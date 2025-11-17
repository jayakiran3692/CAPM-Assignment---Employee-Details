namespace ust.jayakiran.yadlapalli.db;

using { cuid, sap.common.Currencies } from '@sap/cds/common';

using { ust.jayakiran.yadlapalli.reuse as ust } from './common';
// comments
entity EmployeeSet : cuid {
    nameFirst   : String(40);
    nameLast    : String(40);
    nameMiddle  : String(40);
    nameInitials: String(40);
    gender      : ust.Gender;
    language    : String(1);
    phoneNumber : ust.PhoneNumber;
    email       : ust.Email;
    loginName   : String(12);
    CURRENCY_CODE : Association to Currencies;
    salaryAmount: Decimal(10,2);
    accountNumber: String(16);
    bankId      : String(8);
    bankName    : String(64);
}