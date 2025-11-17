using { ust.jayakiran.yadlapalli.db as db } from '../db/employee';

service EmployeeSet {
    entity EmployeeSet as projection on db.EmployeeSet;
}