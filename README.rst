frontend-app-instructor-dashboard
#################################

|license-badge| |status-badge| |ci-badge| |codecov-badge|


Purpose
*******

This repository implements a micro-frontend for Instructor Dashboard, providing a seamless 
and integrated user experience for instructors. It focuses on providing tools and features 
specifically designed for instructors to track student progress, and facilitate communication with learners.

### What is the domain of this MFE?
- Course information (Enrollment info, Basic course info, Pending tasks)
- Membership
- Cohorts
- Extensions
- Student Admin
- Data Download
- Special Exams
- Certificates
- Open Responses

Getting Started
***************

Prerequisites
=============

`Tutor`_ is recommended as the development environment for your new frontend
app.  You can refer to the `relevant tutor-mfe documentation`_ to get started
using it.

.. _Tutor: https://github.com/overhangio/tutor

.. _relevant tutor-mfe documentation: https://github.com/overhangio/tutor-mfe#mfe-development

Cloning and Startup
===================

1. Clone your new repo:

  ``git clone https://github.com/openedx/frontend-app-instructor-dashboard.git``

2. Use node v24.x.

   The current version of the micro-frontend build scripts support node 24.
   Using other major versions of node *may* work, but this is unsupported.  For
   convenience, this repository includes an .nvmrc file to help in setting the
   correct node version via `nvm <https://github.com/nvm-sh/nvm>`_.

3. Install npm dependencies:

  ``cd frontend-app-instructor-dashboard && npm install``

4. Update the application port to use for local development:

   Default port is 8080. If this does not work for you, update the line
   `PORT=8080` to your port in ``site.config.dev.tsx``.

5. Start the dev server:

  ``npm run dev``

The dev server is running at `http://apps.local.openedx.io:8080 <http://apps.local.openedx.io:8080>`_
or whatever port you setup.

Project Structure
=================

The source for this project is organized into nested submodules according to
the `Feature-based Application Organization ADR`_.

.. _Feature-based Application Organization ADR: https://github.com/openedx/frontend-app-instructor-dashboard/blob/main/docs/decisions/0002-feature-based-application-organization.rst

Configuration
=============

``getAppConfig`` resolves three sources, in order of increasing precedence:
the app's bundled ``defaultConfig``, the site's ``commonAppConfig``, and the
app's ``config``. The first is the app author's, at build time; the other two
are the operator's, the second applying to every app on the site and the third
to this app alone.

The instructor dashboard reads exactly one field:

.. list-table::
   :header-rows: 1
   :widths: 30 70

   * - Field
     - Description
   * - ``SUPPORT_URL``
     - Target of the help button the app adds to the header. The button is
       not rendered when this is unset.

Internationalization
====================

Please see refer to the `frontend-base i18n howto`_ for documentation on
internationalization.

.. _frontend-base i18n howto: https://github.com/openedx/frontend-base/blob/main/docs/how_tos/i18n.rst

AlertsProvider
==============

The AlertsProvider is a centralized alert management system that provides four types of alerts:

**Toast Alerts**
  Temporary notifications that appear in the corner and auto-dismiss after 5 seconds (customizable).

  .. code-block:: jsx

    import { useAlert } from './providers/AlertProvider';

    const { showToast } = useAlert();
    showToast('Report generated successfully!', 10000); // 10 second duration

**Modal Alerts**
  Blocking dialogs that require user action. Supports queuing multiple modals and optional titles.

  .. code-block:: jsx

    import { useAlert } from './providers/AlertProvider';

    const { showModal } = useAlert();
    showModal({
      title: 'Delete Report',  // Optional
      message: 'Are you sure you want to delete this report?',
      variant: 'danger',  // 'default' | 'success' | 'warning' | 'danger'
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => console.log('Confirmed'),
      onCancel: () => console.log('Cancelled'),
    });

**Standard Alerts (with AlertOutlet)**
  Drop-in replacement for AlertContext from PR #113. Alerts are rendered via the ``AlertOutlet`` component.

  .. code-block:: jsx

    import { useAlert, AlertOutlet } from './providers/AlertProvider';

    const { addAlert } = useAlert();
    addAlert({ type: 'success', message: 'Cohort created!' });

    // Place AlertOutlet where you want alerts to appear
    <AlertOutlet />

**Inline Alerts**
  Persistent messages you control the rendering for. Useful for form validation or contextual messages.

  .. code-block:: jsx

    import { useAlert } from './providers/AlertProvider';

    const { showInlineAlert, dismissInlineAlert, inlineAlerts } = useAlert();
    showInlineAlert('This is an inline message', 'info', true);

    // Render inline alerts manually
    {inlineAlerts.map(alert => (
      <div key={alert.id}>
        {alert.message}
        {alert.dismissible && (
          <button onClick={() => dismissInlineAlert(alert.id)}>Dismiss</button>
        )}
      </div>
    ))}

Branches and Releases
*********************

This app is published to NPM by ``semantic-release``, and its branches follow
`OEP-10 ADR 0002`_:

``main``
  Unstable.  Every merge publishes a prerelease on the ``alpha`` dist-tag.
  Breaking changes land here with no DEPR process and no warning, so it is
  not supported in production.  All changes, including bug fixes, should
  target this branch first.

``stable``
  Carries the newest stable major and owns the ``latest`` dist-tag.  Changes
  arrive here as backports from ``main``, and no breaking change lands after
  publication.

``n.x`` and ``n.m.x``
  Maintenance branches for majors and minors that ``stable`` has moved past.
  Each owns the dist-tag matching its own name, so consumers select a
  maintained line by semver range, e.g. ``"1.x"``.

Both ``.releaserc`` and the ``Release CI`` workflow already know the whole
layout, including the maintenance branch patterns, so a new line starts
publishing as soon as it is pushed.

This repository is not branched or tagged for Open edX releases in its own
right.  It participates by published version instead, per `OEP-10 ADR 0003`_.

.. _OEP-10 ADR 0002: https://docs.openedx.org/projects/openedx-proposals/en/latest/processes/oep-0010/decisions/0002-frontend-stable-branches.html
.. _OEP-10 ADR 0003: https://docs.openedx.org/projects/openedx-proposals/en/latest/processes/oep-0010/decisions/0003-frontend-release-strategy.html

Getting Help
************

If you're having trouble, we have discussion forums at
https://discuss.openedx.org where you can connect with others in the community.

Our real-time conversations are on Slack. You can request a `Slack
invitation`_, then join our `community Slack workspace`_.  Because this is a
frontend repository, the best place to discuss it would be in the `#wg-frontend
channel`_.

For anything non-trivial, the best path is to open an issue in this repository
with as many details about the issue you are facing as you can provide.

https://github.com/openedx/frontend-app-instructor-dashboard/issues

For more information about these options, see the `Getting Help`_ page.

.. _Slack invitation: https://openedx.org/slack
.. _community Slack workspace: https://openedx.slack.com/
.. _#wg-frontend channel: https://openedx.slack.com/archives/C04BM6YC7A6
.. _Getting Help: https://openedx.org/getting-help

License
*******

The code in this repository is licensed under the AGPLv3 unless otherwise
noted.

Please see `LICENSE <LICENSE>`_ for details.

Contributing
************

Contributions are very welcome.  Please read `How To Contribute`_ for details.

.. _How To Contribute: https://openedx.org/r/how-to-contribute

This project is currently accepting all types of contributions, bug fixes,
security fixes, maintenance work, or new features.  However, please make sure
to have a discussion about your new feature idea with the maintainers prior to
beginning development to maximize the chances of your change being accepted.
You can start a conversation by creating a new issue on this repo summarizing
your idea.

All changes, including bug fixes, should target ``main`` first; see `Branches
and Releases`_ for how they reach ``stable`` and the maintenance lines.

The Open edX Code of Conduct
****************************

All community members are expected to follow the `Open edX Code of Conduct`_.

.. _Open edX Code of Conduct: https://openedx.org/code-of-conduct/

People
******

The assigned maintainers for this component and other project details may be
found in `Backstage`_. Backstage pulls this data from the ``catalog-info.yaml``
file in this repo.

.. _Backstage: https://open-edx-backstage.herokuapp.com/catalog/default/component/frontend-app-instructor-dashboard

Reporting Security Issues
*************************

Please do not report security issues in public, and email security@openedx.org instead.

.. |license-badge| image:: https://img.shields.io/github/license/openedx/frontend-app-instructor-dashboard.svg
    :target: https://github.com/openedx/frontend-app-instructor-dashboard/blob/main/LICENSE
    :alt: License

.. |status-badge| image:: https://img.shields.io/badge/Status-Maintained-brightgreen

.. |ci-badge| image:: https://github.com/openedx/frontend-app-instructor-dashboard/actions/workflows/ci.yml/badge.svg
    :target: https://github.com/openedx/frontend-app-instructor-dashboard/actions/workflows/ci.yml
    :alt: Continuous Integration

.. |codecov-badge| image:: https://codecov.io/github/openedx/frontend-app-instructor-dashboard/coverage.svg?branch=main
    :target: https://codecov.io/github/openedx/frontend-app-instructor-dashboard?branch=main
    :alt: Codecov
