import { generatePID } from '@/utils/pid';
import { getToday, getTomorrow } from '@/utils/time';
import { invoke } from '@tauri-apps/api';
import {
  PatientBioDataType,
  PatientRawType,
  PatientType,
} from '@/types/patient.type';

// rust function names
const CREATE_PATIENT = 'create_patient';
const READ_PATIENTS = 'read_patients';
const READ_ONE_PATIENT = 'read_one_patient';
const SEARCH_PATIENTS = 'search_patients';
const GET_APPOINTMENTS = 'get_appointments';
const GET_APPOINTMENTS_COUNT = 'get_appointments_count';
const UPDATE_PATIENT = 'update_patient';
const DELETE_PATIENT = 'delete_patient';

export const createNewPatient = (
  databasePath: string,
  bioData: PatientBioDataType
) => {
  return new Promise<number>((resolve, reject) => {
    let now = Date.now();

    invoke(CREATE_PATIENT, {
      databasePath,
      pid: generatePID(now),
      createdAt: now,
      updatedAt: now,
      bio_data: JSON.stringify(bioData),
      records: '[]',
      appointment: '',
    })
      .then(resolve)
      .catch(reject);
  });
};

export const readPatients = (databasePath: string, page: number) => {
  return new Promise<PatientRawType[]>((resolve, reject) => {
    invoke(READ_PATIENTS, { databasePath, page }).then(resolve).catch(reject);
  });
};

export const readOnePatient = (databasePath: string, id: number) => {
  return new Promise<PatientRawType>((resolve, reject) => {
    invoke(READ_ONE_PATIENT, {
      databasePath,
      id,
    })
      .then((data: any[]) => resolve(data[0]))
      .catch(reject);
  });
};

export const searchPatients = (
  databasePath: string,
  searchQuery: string,
  page: number
) => {
  return new Promise<PatientRawType[]>((resolve, reject) => {
    invoke(SEARCH_PATIENTS, { databasePath, searchQuery, page })
      .then(resolve)
      .catch(reject);
  });
};

export const getAppointments = (databasePath: string, page: number) => {
  return new Promise<PatientRawType[]>((resolve, reject) => {
    invoke(GET_APPOINTMENTS, {
      databasePath,
      today: new Date(getToday()).getTime(),
      tomorrow: new Date(getTomorrow()).getTime(),
      page,
    })
      .then(resolve)
      .catch(reject);
  });
};

export const getAppointmentsCount = (databasePath: string) => {
  return new Promise<number>((resolve, reject) => {
    invoke(GET_APPOINTMENTS_COUNT, {
      databasePath,
      today: new Date(getToday()).getTime(),
      tomorrow: new Date(getTomorrow()).getTime(),
    })
      .then(resolve)
      .catch(reject);
  });
};

export const updatePatient = (
  databasePath: string,
  patientData: PatientType
) => {
  return invoke(UPDATE_PATIENT, {
    databasePath,
    id: patientData.id,
    updated_at: Date.now(),
    bio_data: JSON.stringify(patientData.bioData),
    records: JSON.stringify(patientData.records),
    appointment: patientData.appointment,
  });
};

export const deletePatient = (databasePath: string, id: number) => {
  return invoke(DELETE_PATIENT, { databasePath, id });
};
