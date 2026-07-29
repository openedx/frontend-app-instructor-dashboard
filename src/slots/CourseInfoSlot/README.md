# Course Info Slot

### Slot ID (owned by the shell): `org.openedx.frontend.slot.header.primaryLinks.v1`

### Widget ID: `org.openedx.frontend.widget.slotShowcase.headerLink`

### Props: none

## Description

`CourseInfoSlot` is the widget this MFE contributes to the shell
header's `primaryLinks.v1` slot (owned by `@openedx/frontend-base`). It
renders the current course's organization, course number, and title
next to the site logo while a user is on any instructor dashboard page,
giving instructors an at-a-glance reminder of the course they are
working in.

The widget takes no props: it reads the `courseId` from the URL
(`react-router-dom`'s `useParams`) and fetches course info via this
MFE's `useCourseInfo` hook, so it stays in sync with the page the
instructor is on and returns `null` while the data is loading or if the
lookup fails.

The widget ID (`org.openedx.frontend.widget.slotShowcase.headerLink`)
can be targeted from `site.config` to change what appears in the header
for instructor dashboard routes: use a `REPLACE` operation to swap in a
different component, or a `REMOVE` operation to hide it entirely.

## Example

The following `site.config.tsx` snippet replaces the default
`CourseInfoSlot` widget with a custom component that renders a shorter
label:

```tsx
import { WidgetOperationTypes } from '@openedx/frontend-base';
import { useParams } from 'react-router-dom';

import { instructorDashboardApp } from './src';

const ShortCourseLabel = () => {
  const { courseId = '' } = useParams();
  return <span className="small font-weight-bold">{courseId}</span>;
};

const app = {
  ...instructorDashboardApp,
  slots: [
    ...(instructorDashboardApp.slots ?? []),
    {
      slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
      id: 'org.openedx.frontend.widget.instructorDashboard.headerLink.mysite',
      op: WidgetOperationTypes.REPLACE,
      relatedId: 'org.openedx.frontend.widget.slotShowcase.headerLink',
      component: ShortCourseLabel,
    },
  ],
};
```

To hide the widget entirely, use a `REMOVE` operation targeting the
same `relatedId`.
