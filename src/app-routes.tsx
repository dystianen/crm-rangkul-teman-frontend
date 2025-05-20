import { withNavigationWatcher } from "./contexts/navigation";
import {
  ActivityUserPage,
  Approval1DetailPage,
  Approval1Page,
  Approval2DetailPage,
  Approval2Page,
  ChatPage,
  ContactCreatePage,
  ContactDetailPage,
  ContactEditPage,
  ContactPage,
  ContractDetailPage,
  ContractPage,
  CreateRolePage,
  CreateUserPage,
  DetailPage,
  DetailUserPage,
  DisburseDetailPage,
  DisbursePage,
  HomePage,
  LoanApp,
  MessageLogPage,
  PreviewPage,
  ProfilePage,
  RepaymentDetailPage,
  RepaymentPage,
  RepaymentScheduleDetailPage,
  RepaymentSchedulePage,
  RestructureCreatePage,
  RestructureDetailPage,
  RestructureListPage,
  RoleListPage,
  Step1Page,
  Step2Page,
  TransactionDetailPage,
  TransactionPage,
  UpdateRolePage,
  UpdateUserPage,
  UploadSignedPage,
  UserListPage
} from "./pages";
import ContactActivities from "./pages/contact-activities";
import CreateEditContactLeads from "./pages/contact/CreateEditContactLeads";
import SavingApplication from "./pages/saving/application";
import FormSavingApplication from "./pages/saving/application/form";
import SavingContract from "./pages/saving/contract";
import SavingContractDetail from "./pages/saving/contract/detail";
import SavingCustomer from "./pages/saving/customer";
import SavingCustomerDetail from "./pages/saving/customer/detail";
import SavingPayment from "./pages/saving/payment";
import SavingWithdraw from "./pages/saving/withdraw";
import SavingWithdrawDetail from "./pages/saving/withdraw/detail";

const routes = [
  {
    ID: 1,
    path: "/contact/create",
    title: "Create Contact",
    element: ContactCreatePage
  },
  {
    ID: 21,
    path: "/contact/detail",
    title: "Detail Contact",
    element: ContactDetailPage
  },
  {
    ID: 2,
    path: "/contact/edit",
    title: "Edit Contact",
    element: ContactEditPage
  },
  {
    ID: 3,
    path: "/contact",
    title: "Contact",
    element: ContactPage
  },
  {
    ID: 32,
    path: "/contact-activities",
    title: "Contact Activities",
    element: ContactActivities
  },
  {
    ID: 29,
    path: "/contact/leads/create",
    title: "Create Leads",
    element: CreateEditContactLeads
  },
  {
    ID: 30,
    path: "/contact/leads/edit",
    title: "Edit Leads",
    element: CreateEditContactLeads
  },
  {
    ID: 4,
    path: "/profile",
    title: "Profile",
    element: ProfilePage
  },
  {
    ID: 5,
    path: "/home",
    title: "Home",
    element: HomePage
  },
  {
    ID: 6,
    path: "/loan-app",
    title: "Loan Application",
    element: LoanApp
  },
  {
    ID: 7,
    path: "/loan-app/create/step/1",
    title: "Loan Application Step 1",
    element: Step1Page
  },
  {
    ID: 8,
    path: "/loan-app/create/step/2",
    title: "Loan Application Step 2",
    element: Step2Page
  },
  {
    ID: 9,
    path: "/loan-app/create/preview",
    title: "Loan Application Preview",
    element: PreviewPage
  },
  {
    ID: 10,
    path: "/loan-app/detail",
    title: "Loan Application Detail",
    element: DetailPage
  },
  {
    ID: 11,
    path: "/loan-app/detail/upload-signed",
    title: "Loan Application Detail Upload Signed Document",
    element: UploadSignedPage
  },
  {
    ID: 12,
    path: "/approval1/detail",
    title: "Loan Approval 1 Detail",
    element: Approval1DetailPage
  },
  {
    ID: 13,
    path: "/approval1",
    title: "Loan Approval",
    element: Approval1Page
  },
  {
    ID: 14,
    path: "/approval2/detail",
    title: "Loan Approval 2 Detail",
    element: Approval2DetailPage
  },
  {
    ID: 15,
    path: "/approval2",
    title: "Loan Approval 2",
    element: Approval2Page
  },
  {
    ID: 16,
    path: "/contract",
    title: "Loan Agreement",
    element: ContractPage
  },
  {
    ID: 17,
    path: "/contract/detail",
    title: "Loan Agreement Detail ",
    element: ContractDetailPage
  },
  {
    ID: 18,
    path: "/disburse",
    title: "Disbursement",
    element: DisbursePage
  },
  {
    ID: 19,
    path: "/disburse/detail",
    title: "Disbursement Detail ",
    element: DisburseDetailPage
  },
  {
    ID: 20,
    path: "/repayment",
    title: "Repayment",
    element: RepaymentPage
  },
  {
    ID: 21,
    path: "/repayment/detail",
    title: "Repayment Detail ",
    element: RepaymentDetailPage
  },
  {
    ID: 22,
    path: "/transaction",
    title: "Transaction",
    element: TransactionPage
  },
  {
    ID: 23,
    path: "/transaction/detail",
    title: "Transaction Detail ",
    element: TransactionDetailPage
  },
  {
    ID: 24,
    path: "/message-log",
    title: "Riwayat Pesan",
    element: MessageLogPage
  },
  {
    ID: 25,
    path: "/user-activity",
    title: "Aktivitas Pengguna",
    element: ActivityUserPage
  },
  {
    ID: 26,
    path: "/repayment-schedule",
    title: "Jadwal Pembayaran",
    element: RepaymentSchedulePage
  },
  {
    ID: 27,
    path: "/repayment-schedule/detail",
    title: "Detil Jadwal Pembayaran",
    element: RepaymentScheduleDetailPage
  },
  {
    ID: 28,
    path: "/whatsapp/chat",
    title: "Chat",
    element: ChatPage
  },
  {
    ID: 29,
    path: "/restructure",
    title: "Restruktur",
    element: RestructureListPage
  },
  {
    ID: 30,
    path: "/restructure/detail",
    title: "Detil Restruktur",
    element: RestructureDetailPage
  },
  {
    ID: 31,
    path: "/restructure/create",
    title: "Create Restruktur",
    element: RestructureCreatePage
  },
  {
    ID: 32,
    path: "/backoffice/user",
    title: "Pengguna",
    element: UserListPage
  },
  {
    ID: 33,
    path: "/backoffice/user/create",
    title: "Buat Pengguna",
    element: CreateUserPage
  },
  {
    ID: 34,
    path: "/backoffice/user/update",
    title: "Ubah Pengguna",
    element: UpdateUserPage
  },
  {
    ID: 35,
    path: "/backoffice/user/detail",
    title: "Detil Pengguna",
    element: DetailUserPage
  },
  {
    ID: 36,
    path: "/saving/application",
    title: "Saving Application",
    element: SavingApplication
  },
  {
    ID: 37,
    path: "/saving/application/form",
    title: "Saving Application",
    element: FormSavingApplication
  },
  {
    ID: 38,
    path: "/saving/payment",
    title: "Saving Payment",
    element: SavingPayment
  },
  {
    ID: 39,
    path: "/saving/contract",
    title: "Saving Contract",
    element: SavingContract
  },
  {
    ID: 40,
    path: "/saving/contract/detail",
    title: "Saving Contract Detail",
    element: SavingContractDetail
  },
  {
    ID: 41,
    path: "/saving/customer",
    title: "Saving Customer",
    element: SavingCustomer
  },
  {
    ID: 42,
    path: "/saving/customer/detail",
    title: "Saving Customer Detail",
    element: SavingCustomerDetail
  },
  {
    ID: 43,
    path: "/saving/withdraw",
    title: "Saving Withdraw",
    element: SavingWithdraw
  },
  {
    ID: 43,
    path: "/saving/withdraw/detail",
    title: "Saving Withdraw Detail",
    element: SavingWithdrawDetail
  },
  {
    ID: 44,
    path: "/backoffice/role",
    title: "Peran Pengguna",
    element: RoleListPage
  },
  {
    ID: 45,
    path: "/backoffice/role/create",
    title: "Buat Peran Pengguna",
    element: CreateRolePage
  },
  {
    ID: 46,
    path: "/backoffice/role/update",
    title: "Ubah Peran Pengguna",
    element: UpdateRolePage
  }
];

//@ts-ignore
export default routes.map((route) => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path)
  };
});
