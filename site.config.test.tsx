import { EnvironmentTypes, SiteConfig } from '@openedx/frontend-base';

const siteConfig: SiteConfig = {
  siteId: 'instructor-test-site',
  siteName: 'Instructor Test Site',
  baseUrl: 'http://localhost:8080',
  lmsBaseUrl: 'http://localhost:8000',
  cmsBaseUrl: 'http://localhost:8001',
  loginUrl: 'http://localhost:8000/login',
  logoutUrl: 'http://localhost:8000/logout',

  // if EnvironmentTypes.TEST is set, some tests fails due to it, TODO: update here once this issue is fixed in frontend-base
  environment: EnvironmentTypes?.TEST ?? 'test',
  apps: [{
    appId: 'org.openedx.frontend.app.instructorDashboard',
    config: {}
  }],
};

export default siteConfig;
