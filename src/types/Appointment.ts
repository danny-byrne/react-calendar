import { GetAppointmentsQuery } from 'src/graphQL/serverMocks/graphQLGeneratedCode';

export type Appointment = GetAppointmentsQuery['careRecipientAppointments']['appointments'][0];
