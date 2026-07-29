# `frontend-app-instructor-dashboard` Slots

## Overview

Slots in `frontend-app-instructor-dashboard` use the slot system from
[`@openedx/frontend-base`](https://github.com/openedx/frontend-base) to
provide modular extension points in the Instructor Dashboard MFE.
Widgets can be dynamically registered at specific UI locations from a
`site.config` without changing this MFE's code.

Each subdirectory below has its own README describing a single
extension point — its slot ID, the default widget, the props passed to
widgets, and an example `site.config` snippet.

## Slots exposed by this MFE

- [`org.openedx.frontend.slot.instructorDashboard.enrollmentActions.v1`](./EnrollmentActionsSlot/)
  — Action buttons ("Enroll Learners" / "Add Beta Testers") in the
  header of the **Enrollments** tab.
- [`org.openedx.frontend.slot.instructorDashboard.tabs.v1`](./PlaceholderSlot/)
  — Register additional tabs in the instructor dashboard navigation.
  Widgets registered into this slot use the
  [`PlaceholderSlot`](./PlaceholderSlot/) helper element to carry
  `tabId`, `title`, `url`, and `sortOrder` props.
- [`org.openedx.frontend.slot.instructorDashboard.routes.v1`](./PlaceholderSlot/)
  — Register the content rendered when a custom tab (added via the
  `tabs.v1` slot) is active. Also uses
  [`PlaceholderSlot`](./PlaceholderSlot/).

## Widgets provided by this MFE for other apps' slots

- [`CourseInfoSlot`](./CourseInfoSlot/) — Widget this MFE registers into
  the shell header's
  `org.openedx.frontend.slot.header.primaryLinks.v1` slot to display
  the current course's organization, course number, and title next to
  the site logo while on the instructor dashboard.

## Helpers

- [`SlotUtils.tsx`](./SlotUtils.tsx) — `useWidgetProps` /
  `extractWidgetProps` helpers used to read props off widgets registered
  into prop-carrying slots such as the tabs and routes slots above.

