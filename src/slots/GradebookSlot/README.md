# Gradebook Slot

### Slot ID: `org.openedx.frontend.slot.ccxCoach.studentGrades.v1`

### Props:
* `courseId` - The identifier of the CCX course whose gradebook should be rendered. Provided so a widget can build the correct app/route to the gradebook for the current course.
* `onBack` - Handler that returns the user to the Student Grades tab. The MFE owns the "show gradebook / show grades tab" toggle, so a widget only needs to call this handler when the operator wants to leave the gradebook view (e.g. a Back button in a custom gradebook UI).

## Description

This slot is used to render the Gradebook inside the **Student Grades** tab of the **CCX Coach** dashboard. When the coach clicks **View Gradebook**, the MFE renders this slot in place of the Student Grades tab content and expects the plugged-in widget to render the Gradebook experience for the given `courseId`.

The openedx [frontend-app-gradebook](https://github.com/openedx/frontend-app-gradebook) MFE ships
its own widget registration for this slot on its `App.slots` array, following the frontend-base slot composition pattern. This means that operators do **not** need to declare a widget operation themselves: adding `gradebookApp` to the `apps[]` list in their `site.config` is enough for the Gradebook to render inside this slot out of the box.

The slot ID is exported from `@src/constants` as `studentGradesSlotId` so it can be referenced from a `site.config` when an operator needs to override the default behavior — for example, to `REPLACE` the openedx Gradebook widget with a custom implementation.

## :warning: Note for operators

* **If your deployment has the Gradebook disabled** (i.e. `gradebookApp` is not included in your `site.config` `apps[]`), no widget is registered on this slot and nothing will render when the coach clicks **View Gradebook**. You may also want to hide the **View Gradebook** button and/or the Student Grades tab in your configuration to avoid navigating coaches to an empty view.
* **If you use a custom Gradebook** (i.e. you are not using `frontend-app-gradebook`), you must register the corresponding widget on this slot yourself so that your custom Gradebook is rendered here. Target `studentGradesSlotId` with a `REPLACE` operation (to swap the openedx Gradebook widget) or an `APPEND` operation (if no default is registered), and make sure your widget consumes `courseId` and calls `onBack` to return the coach to the Student Grades tab.

## Example

In most cases operators only need to include `gradebookApp` in their `site.config` `apps[]` and the Gradebook widget will be composed into this slot automatically:

```tsx
import { gradebookApp } from '@openedx/frontend-app-gradebook';
import { instructorDashboardApp } from '@openedx/frontend-app-instructor-dashboard';

const siteConfig = {
  // ...
  apps: [
    instructorDashboardApp,
    gradebookApp,
    // ...other apps
  ],
};
```

To plug in a custom Gradebook instead, target the slot with a `REPLACE` operation on the instructor dashboard app entry:

```tsx
import { WidgetOperationTypes } from '@openedx/frontend-base';
import { Button } from '@openedx/paragon';
import { ArrowBack } from '@openedx/paragon/icons';
import { studentGradesSlotId, instructorDashboardApp } from '@openedx/frontend-app-instructor-dashboard';

const CustomGradebook = ({ courseId, onBack }: { courseId: string; onBack: () => void }) => (
  <div className="d-flex flex-column" style={{ height: '100vh' }}>
    <div className="p-2">
      <Button variant="tertiary" iconBefore={ArrowBack} onClick={onBack}>
        Back to Student Grades
      </Button>
    </div>
    <iframe
      title="Custom Gradebook"
      src={`https://gradebook.example.com/${courseId}`}
      style={{ flex: 1, border: 0 }}
    />
  </div>
);

const app = {
  ...instructorDashboardApp,
  slots: [
    ...(instructorDashboardApp.slots ?? []),
    {
      slotId: studentGradesSlotId,
      id: 'org.openedx.frontend.widget.ccxCoach.studentGrades.mysite',
      op: WidgetOperationTypes.REPLACE,
      component: CustomGradebook,
    },
  ],
};
```
