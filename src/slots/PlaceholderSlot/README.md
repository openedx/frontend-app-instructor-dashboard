# Instructor Tabs & Routes Slots (`PlaceholderSlot` helper)

### Slot IDs

- `org.openedx.frontend.slot.instructorDashboard.tabs.v1` — nav tabs.
- `org.openedx.frontend.slot.instructorDashboard.routes.v1` — content
  rendered for a tab.

### Default widgets: none

Both slots ship empty. The instructor dashboard already renders a
built-in set of tabs (Course Info, Enrollments, Course Team, Cohorts,
Grading, etc.); these slots exist so a site operator can add new tabs
alongside them.

## Description

Two related slots let a `site.config` extend the instructor dashboard
navigation:

- **`instructorDashboard.tabs.v1`** — Registers an entry in the
  instructor navigation bar. Each registered widget carries the props
  needed to render a tab (`tabId`, `title`, `url`, and an optional
  `sortOrder`).
- **`instructorDashboard.routes.v1`** — Registers the React node
  rendered when a given tab is active. Widgets carry `tabId` plus the
  `content` node.

Because both slots need to pass raw props through to their consumers
rather than render UI themselves, they are used together with the
[`PlaceholderSlot`](./PlaceholderSlot.tsx) helper element:

```tsx
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const PlaceholderSlot = (_props: Record<string, any>) => null;
```

`PlaceholderSlot` renders nothing. Its only purpose is to hold the
props ([`TabProps`](../../instructorNav/InstructorNav.tsx) or
`InstructorRouteProps`) that the slot consumer reads via the
[`useWidgetProps`](../SlotUtils.tsx) helper.

The consumers are:

- [`InstructorNav`](../../instructorNav/InstructorNav.tsx) — merges the
  API-provided tabs with `tabs.v1` widgets, deduplicates by `tabId`, and
  sorts by `sortOrder` (default `1000`). Tabs with a `url` starting
  with `/` render as internal `<Link>`s; other URLs render as external
  links.
- [`TabContent`](../../routes.tsx) — resolves the current `tabId` from
  the URL and renders either the matching built-in page or the
  `content` node of the matching `routes.v1` widget. Widgets whose
  `tabId` matches a built-in tab replace that tab's content.

### `PlaceholderSlot` props

| Prop        | Slot         | Type          | Description |
| ----------- | ------------ | ------------- | ----------- |
| `tabId`     | `tabs.v1` & `routes.v1` | `string` | Stable identifier for the tab. Also used to match a `routes.v1` widget to its `tabs.v1` widget. |
| `title`     | `tabs.v1`    | `string`      | Text shown in the nav bar. Widgets missing `title` or `tabId` are skipped. |
| `url`       | `tabs.v1`    | `string`      | Destination the tab links to. Values starting with `/` are treated as internal routes. |
| `sortOrder` | `tabs.v1`    | `number` (optional) | Ordering within the nav. Defaults to `1000` (rendered at the end). |
| `content`   | `routes.v1`  | `ReactNode`   | Element rendered when this tab is active. |

## Example

The following `site.config.dev.tsx` adds a new **New Tab** to the
instructor navigation and renders `<div>Dynamic Content</div>` when it
is selected:

![Instructor Tabs with New Tab selected and dynamic content displayed](./NewTabSlot.png)

```tsx
import {
  EnvironmentTypes,
  SiteConfig,
  WidgetOperationTypes,
  footerApp,
  headerApp,
  shellApp,
} from '@openedx/frontend-base';
import { PlaceholderSlot } from './src/slots/PlaceholderSlot/PlaceholderSlot';

import { instructorDashboardApp } from './src';

import '@openedx/frontend-base/shell/style';

const siteConfig: SiteConfig = {
  siteId: 'instructor-dev',
  siteName: 'Instructor Dev',
  baseUrl: 'http://apps.local.openedx.io:8080',
  lmsBaseUrl: 'http://local.openedx.io:8000',
  loginUrl: 'http://local.openedx.io:8000/login',
  logoutUrl: 'http://local.openedx.io:8000/logout',

  environment: EnvironmentTypes.DEVELOPMENT,
  apps: [
    shellApp,
    headerApp,
    footerApp,
    {
      ...instructorDashboardApp,
      slots: [
        {
          slotId: 'org.openedx.frontend.slot.instructorDashboard.tabs.v1',
          id: 'org.openedx.frontend.widget.instructorDashboard.tab.my_tab',
          op: WidgetOperationTypes.APPEND,
          element: (
            <PlaceholderSlot
              tabId="my_tab"
              title="New Tab"
              url="/my_tab"
              sortOrder={25}
            />
          ),
        },
        {
          slotId: 'org.openedx.frontend.slot.instructorDashboard.routes.v1',
          id: 'org.openedx.frontend.widget.instructorDashboard.route.my_tab',
          op: WidgetOperationTypes.APPEND,
          element: (
            <PlaceholderSlot
              tabId="my_tab"
              content={<div>Dynamic Content</div>}
            />
          ),
        },
      ],
    },
  ],

  accessTokenCookieName: 'edx-jwt-cookie-header-payload',
};

export default siteConfig;
```

### How the consumers read the props

`InstructorNav` collects the tab widgets and merges them with the tabs
returned by the course-info API:

```tsx
const widgetPropsArray = useWidgetProps(
  'org.openedx.frontend.slot.instructorDashboard.tabs.v1'
) as TabProps[];
```

`TabContent` picks the widget whose `tabId` matches the URL and
renders its `content`:

```tsx
const TabContent = () => {
  const { tabId } = useParams<{ tabId: string }>();
  const routeWidgets = useWidgetProps(
    'org.openedx.frontend.slot.instructorDashboard.routes.v1'
  ) as InstructorRouteProps[];

  const tabRoutes = [
    ...defaultTabs.filter(
      defaultTab => !routeWidgets.some(slotTab => slotTab.tabId === defaultTab.tabId)
    ),
    ...routeWidgets,
  ];

  return tabRoutes.find(tab => tab.tabId === tabId)?.content;
};
```
