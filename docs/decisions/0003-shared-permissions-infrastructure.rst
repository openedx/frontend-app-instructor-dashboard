3. Shared Permissions Infrastructure in the MFE
-----------------------------------------------

Status
------

Proposed

Context
-------

The Instructor Dashboard is gaining granular, per-action permissions driven by
the ``openedx-authz`` project. This ADR defines the shared frontend
infrastructure that the per-tab enforcement subtasks (openedx-authz issues #496
through #501) consume: a context/store, a reusable hook, a guard component,
routing behaviour for direct-URL access, and consistent handling of backend
``403`` responses.

``frontend-base`` ships a shared ``usePermissions`` hook that other MFEs (course
authoring, admin console) already use. It asks openedx-authz's
``POST /api/authz/v1/permissions/validate/me`` whether the user holds each
requested permission. It takes a ``featureEnabled`` boolean: when ``false`` it
makes no request and allows every permission, keeping the legacy behaviour
during the gradual rollout. The caller is responsible for reading its own
waffle flag.

The AuthZ flag for course features (``authz.enable_course_authoring``) can be
overridden per course, so the MFE needs its value for the current course.

Alternatives considered
=======================

These were discussed in the review of this ADR's pull request
(openedx/frontend-app-instructor-dashboard#266).

**A. Effective permissions in ``CourseMetadataView``.** The first version of
this work had the backend return an ``authz_permissions`` map of every
dashboard permission with its value. It needed no extra request, but it was
specific to this app, fixed the list of permissions in openedx-platform, put
AuthZ logic in an openedx-platform view, tied permission caching to course
metadata, and needed a workaround so ``camelCaseObject`` would not mangle the
dotted keys.

**B. ``usePermissions`` with a separate flag endpoint.** Matches the other
MFEs, but reading a per-course flag would need either the Studio
``course_waffle_flags`` endpoint (an LMS dashboard depending on Studio) or a
backend change to openedx-authz's ``waffle-flag-states`` endpoint, plus one more
request before the permission check.

**C. ``usePermissions`` with the flag in ``CourseMetadataView`` (chosen).** The
backend returns a single ``authz_enabled`` boolean for the course on the course
info the dashboard already loads, and the MFE passes it to ``usePermissions``
as ``featureEnabled``. This keeps the shared hook and its cache keys, needs no
new endpoint or Studio dependency, and reduces the backend contract to one
boolean.

Decision
--------

Use option C.

**Feature folder: ``src/permissions/``.** Per ADR-0002, features are named for
their role in this app, not for the upstream project that motivated them.

**Module boundary.** ``src/permissions/`` exposes a public ``index.ts`` barrel
(ADR-0002 strict module boundary). Consumers import from ``@src/permissions``,
never from deep paths.

**One request for all dashboard permissions, no provider.** Every gate and hook
goes through one internal hook that always calls ``usePermissions`` with the
same query: every dashboard permission, scoped to the course. React Query
compares query keys by value, so all callers share one cache entry and one
``validate/me`` request per course. A React context provider is not needed to
share the result. Calling ``usePermissions`` directly with a smaller query
would create a separate cache entry and request, so consumers use the
permissions module instead.

Because the course id is part of the query, each course gets its own cache
entry. Navigating to another course requests that course's permissions and
reports loading until they arrive, rather than showing the previous course's
values.

Components
==========

1. **Constants** (``src/permissions/constants.ts``): ``COURSE_PERMISSIONS``, the
   permission identifiers the dashboard checks, mirroring the backend's
   ``INSTRUCTOR_DASHBOARD_PERMISSIONS``. ``PermissionId`` is derived from it.

2. **Shared hook** (``src/permissions/useCoursePermissions.ts``, internal): reads
   ``authzEnabled`` from ``useCourseInfo(courseId)`` and calls
   ``usePermissions`` with the full query. It returns
   ``{ permissions, isLoading, isAuthzEnabled, error }``. It reports loading
   until the course info arrives; otherwise ``usePermissions`` would see
   ``featureEnabled=false`` for a moment and briefly allow everything.

3. **Hook** (``src/permissions/useCoursePermission.ts``):
   ``useCoursePermission(COURSE_PERMISSIONS.ENROLL_LEARNERS)`` returns
   ``{ allowed, isLoading }``. ``allowed`` is ``false`` while loading, ``true``
   for every permission when AuthZ is disabled for the course, and the
   openedx-authz answer otherwise. If the permission check fails, the
   permissions resolve to ``false`` (fail closed), which is the
   ``usePermissions`` default.

4. **Guard** (``src/permissions/PermissionGate.tsx``):
   ``<PermissionGate permission={…} mode="hide" | "disable">``. Supports a single
   ``permission`` or ``anyOf``. Because the hide-vs-disable design is still
   pending (openedx-authz #494/#495), the component supports both; the default
   per tab is chosen by each subtask once designs land.

5. **Routing / no-access** (reuses the ``AccessErrorProvider`` chain): a user
   who opens a tab URL directly without permission sees the existing
   ``forbidden`` state rather than a new bespoke one. Tab visibility itself
   remains backend-driven through ``courseInfo.tabs``.

6. **403 handling**: ``usePermissionDeniedHandler`` surfaces a toast via
   ``AlertProvider`` when a mutation returns ``403`` (frontend and backend
   disagree). Documented as the default ``onError`` convention for action
   mutations in the per-tab subtasks.

Consequences
------------

Per-tab subtasks become almost mechanical: import ``useCoursePermission`` /
``PermissionGate`` and ``COURSE_PERMISSIONS`` from ``@src/permissions`` and wrap
the relevant actions. Current behaviour is preserved while AuthZ is disabled for
a course.

When AuthZ is enabled, the dashboard sends one extra ``validate/me`` request
after the course info loads. Its result is cached for five minutes
(``usePermissions`` default); ``permissionsQueryKeys`` from ``frontend-base`` can
invalidate it if roles change mid-session.

Adding a permission means adding it to ``COURSE_PERMISSIONS``; no
openedx-platform change is needed as long as openedx-authz defines it.

The MFE requires a ``frontend-base`` version that ships ``usePermissions``.

References
----------

- openedx-authz issue #495: Shared permissions infrastructure in the MFE
- openedx-authz issue #494: Granular permissions in the Instructor Dashboard MFE
- openedx-authz issue #486 / openedx-platform PR #39255: backend ``authz_enabled``
- openedx/frontend-app-instructor-dashboard PR #266: review discussion of the alternatives
- ADR-0002: Feature-based Application Organization
