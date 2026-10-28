3. Shared Permissions Infrastructure in the MFE
-----------------------------------------------

Status
------

Proposed

Context
-------

The Instructor Dashboard is gaining granular, per-action permissions driven by
the ``openedx-authz`` project. The backend work (openedx-authz issue #486,
openedx-platform PR #39255) extends ``CourseMetadataView``
(``GET /api/instructor/v2/courses/{course_id}``) with a new, separate
``authz_permissions`` field:

- It is distinct from the pre-existing legacy ``permissions`` field. Existing
  fields do not change; the backend only adds.
- Its shape is a flat map of permission identifier to boolean, e.g.
  ``{"courses.enroll_learners": true, "courses.view_enrollments": false}``.
- The identifiers are fixed in the backend's
  ``INSTRUCTOR_DASHBOARD_PERMISSIONS`` (14 of them, covering course info,
  enrollments, course team, grading, date extensions and cohorts).
- The field is only populated once the backend AuthZ flag is enabled for the
  course. When disabled, the field may be absent.

This ADR defines the shared frontend infrastructure that the per-tab
enforcement subtasks (openedx-authz issues #496 through #501) consume. It
covers a context/store, a reusable hook, a guard component, routing behaviour
for direct-URL access, and consistent handling of backend ``403`` responses.

Decision
--------

**Feature folder: ``src/permissions/``.** Per ADR-0002, features are named for
their role in this app, not for the upstream project that motivated them. The
code's job here is to consume effective permissions and gate UI, so the domain
name is ``permissions``.

**Module boundary.** ``src/permissions/`` exposes a public ``index.ts`` barrel
(ADR-0002 strict module boundary). Consumers import from ``@src/permissions``,
never from deep paths.

**Key normalization.** The MFE runs responses through ``camelCaseObject``, which
deep-camelCases every key and would turn ``courses.enroll_learners`` into
``coursesEnrollLearners``, destroying the dotted identifiers the hook needs. The
API layer therefore reads the raw ``authz_permissions`` map off the response
before camelCasing and re-attaches it with its dotted keys intact.

Components
==========

1. **Types** (``src/permissions/types.ts``): a ``PermissionId`` string-union of
   the 14 known identifiers (for autocomplete) and the context/provider shapes.
   ``CourseInfoResponse`` gains an optional
   ``authzPermissions?: Record<string, boolean>``. The hook accepts any
   ``string`` to stay forward-compatible with new backend permissions.

2. **Context** (``src/permissions/PermissionContext.tsx``): a
   ``PermissionProvider`` that reads ``useCourseInfo(courseId)`` and exposes
   ``{ permissions, isLoading, error }`` with the dotted keys normalized. Mounted
   in ``Main.tsx`` alongside ``AccessErrorProvider`` so every tab consumes it
   without an extra fetch.

3. **Hook** (``src/permissions/useCoursePermission.ts``):
   ``useCoursePermission('courses.enroll_learners')`` returns
   ``{ allowed, isLoading }``. Fallback semantics: permissive when the
   ``authzPermissions`` field is entirely absent (pre-rollout, so current
   behaviour is unchanged), restrictive when the field is present but the key is
   ``false``.

4. **Guard** (``src/permissions/PermissionGate.tsx``):
   ``<PermissionGate permission="…" mode="hide" | "disable">``. Supports a single
   ``permission`` or ``anyOf``. Because the hide-vs-disable design is still
   pending (openedx-authz #494/#495), the component supports both; the default
   per tab is chosen by each subtask once designs land.

5. **Routing / no-access** (reuses ``AccessErrorProvider`` chain): a user who
   opens a tab URL directly without permission sees the existing ``forbidden``
   state rather than a new bespoke one. Tab visibility itself remains
   backend-driven through ``courseInfo.tabs``.

6. **403 handling**: a ``handlePermissionDenied`` helper surfaces a toast via
   ``AlertProvider`` when a mutation returns ``403`` (frontend and backend
   disagree). Documented as the default ``onError`` convention for action
   mutations in the per-tab subtasks.

Consequences
------------

Per-tab subtasks become almost mechanical: import ``useCoursePermission`` /
``PermissionGate`` from ``@src/permissions`` and wrap the relevant actions.
Current behaviour is preserved until each subtask lands, satisfying the
acceptance criterion that tab behaviour does not change until the subtasks are
implemented. The hook and guard ship with unit tests (React Testing Library),
including an explicit test that the dotted permission keys survive the
``camelCaseObject`` round-trip.

References
----------

- openedx-authz issue #495: Shared permissions infrastructure in the MFE
- openedx-authz issue #494: Granular permissions in the Instructor Dashboard MFE
- openedx-authz issue #486 / openedx-platform PR #39255: backend ``authz_permissions``
- ADR-0002: Feature-based Application Organization
