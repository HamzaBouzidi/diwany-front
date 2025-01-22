import { AutorisationListComponent } from './Components/autorisation-list/autorisation-list.component';
import { Routes } from '@angular/router';
import { NationalIdentityCardComponent } from './Components/national-identity-card/national-identity-card.component';
import { VacationsComponent } from './Components/vacations/vacations.component';
import { ShortVacationRequestComponent } from './Components/short-vacation-request/short-vacation-request.component';
import { VacationListComponent } from './Components/vacations-list/vacations-list.component';
import { AutorisationRequestComponent } from './Components/autorisation-request/autorisation-request.component';
import { AutorisationComponent } from './Components/autorisation/autorisation.component';
import { MorningLateRequestComponent } from './Components/morning-autorisation-request/morning-autorisation-request.component';
import { DefinitionsAutorisationsComponent } from './Components/definitions-autorisations/definitions-autorisations.component';
import { ReleaseFormComponent } from './Components/release-form/release-form.component';
import { TestReportWorkingPeriodComponent } from './Components/test-report-working-period/test-report-working-period.component';
import { MemberNominationFormComponent } from './Components/member-nomination-form/member-nomination-form.component';
import { AcknowledgmentPledgeComponent } from './Components/acknowledgment-pledge/acknowledgment-pledge.component';
import { ReportsComponent } from './Components/reports/reports.component';
import { HealthAssuranceComponent } from './Components/health-assurance/health-assurance.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { LayoutComponent } from './Components/layout/layout.component';
import { AuthLayoutComponentComponent } from './layouts/auth-layout-component/auth-layout-component.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { HrAuthorizationsListComponent } from './pages/hr/hr-authorizations-list/hr-authorizations-list.component';
import { HrDashboardComponent } from './pages/hr/hr-dashboard/hr-dashboard.component';
import { HrHealthAssuranceListComponent } from './pages/hr/hr-health-assurance-list/hr-health-assurance-list.component';
import { HrNationalIdentityCardListComponent } from './pages/hr/hr-national-identity-card-list/hr-national-identity-card-list.component';
import { HrVacationsListComponent } from './pages/hr/hr-vacations-list/hr-vacations-list.component';
import { HrWorkingPeriodReportFormComponent } from './pages/hr/hr-working-period-report-form/hr-working-period-report-form.component';
import { HrWorkingPeriodReportListComponent } from './pages/hr/hr-working-period-report-list/hr-working-period-report-list.component';
import { HrLayoutComponent } from './layouts/hr-layout/hr-layout.component';
import { HrReleaseFormComponent } from './pages/hr/hr-release-form/hr-release-form.component';
import { HrReleaseListComponent } from './pages/hr/hr-release-list/hr-release-list.component';
import { HrReportsComponent } from './pages/hr/hr-reports/hr-reports.component';
import { PledgeUploadComponent } from './Components/pledge-upload/pledge-upload.component';
import { HrPledgeListComponent } from './pages/hr/hr-pledge-list/hr-pledge-list.component';
import { LoginComponent } from './pages/login/login.component';
import { HrGuard } from './guards/hr.guard';
import { HrNominationListComponent } from './pages/hr/hr-nomination-list/hr-nomination-list.component';

export const routes: Routes = [

    {
        path: 'dashboard',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            
            { path: 'vacations', component: VacationsComponent },
            { path: 'vacations/vacation-request', component: ShortVacationRequestComponent },
            { path: 'vacations/vacation-list', component: VacationsComponent },
            { path: 'vacations/vacation-management', component: VacationsComponent },
            { path: 'vacations/vacations-list', component: VacationListComponent },
            { path: 'autorisation/autorisation', component: AutorisationComponent },
            { path: 'autorisation/autorisation-request', component: AutorisationRequestComponent },
            { path: 'autorisation/morning-autorisation-request', component: MorningLateRequestComponent },
            { path: 'autorisation/autorisation-list', component: AutorisationListComponent },
            { path: 'definitions-autorisations', component: DefinitionsAutorisationsComponent },
            { path: 'definitions-autorisations/national-identity', component: NationalIdentityCardComponent },
            { path: 'definitions-autorisations/release-form', component: ReleaseFormComponent },
            { path: 'definitions-autorisations/test-report-for-working-period', component: TestReportWorkingPeriodComponent },
            { path: 'definitions-autorisations/member-nomination-form', component: MemberNominationFormComponent },
            { path: 'definitions-autorisations/acknowledgment-pledge', component: AcknowledgmentPledgeComponent },
            { path: 'definitions-autorisations/reports', component: ReportsComponent },
            { path: 'definitions-autorisations/health-assurance', component: HealthAssuranceComponent },
            //{ path: 'home', component: HomeComponent },
            { path: 'pledge-upload', component: PledgeUploadComponent },

        ]
    },
    {
        path: 'hr',
        component: HrLayoutComponent,
        canActivate: [HrGuard],
        children: [
            { path: 'authorizations-list', component: HrAuthorizationsListComponent },
            { path: 'vacations-list', component: HrVacationsListComponent },
            { path: 'dashboard', component: HrDashboardComponent },
            { path: 'health-assurance-list', component: HrHealthAssuranceListComponent },
            { path: 'national-card-list', component: HrNationalIdentityCardListComponent },
            { path: 'working-period/form', component: HrWorkingPeriodReportFormComponent },
            { path: 'working-period/list', component: HrWorkingPeriodReportListComponent },
            { path: 'release-form', component: HrReleaseFormComponent },
            { path: 'releases-list', component: HrReleaseListComponent },
            { path: 'reports', component: HrReportsComponent },
            { path: 'pledge-list', component: HrPledgeListComponent },
            { path: 'work-period-report-form', component: HrWorkingPeriodReportFormComponent },
            { path: 'nomination-list', component: HrNominationListComponent },



        ]
    },
    {path: '' ,
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path: '',
        component: AuthLayoutComponentComponent,
        children: [

            { path: 'sign-up', component: SignUpComponent },
            { path: 'login', component: LoginComponent  },

        ]
    },





    { path: '**', component: LoginComponent },

];
