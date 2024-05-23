const API_BASE_URL_USER =
  'https://e59hd00w64.execute-api.eu-central-1.amazonaws.com/prod';
const API_BASE_URL_INTEGRATORS =
  'https://q5ra0q4ukk.execute-api.eu-central-1.amazonaws.com/prod';

export const endpoints = {
  login: `${API_BASE_URL_USER}/login`,
  firstLogin: (username) => `${API_BASE_URL_USER}/firstLogin/${username}`,
  register: (userID) => `${API_BASE_URL_USER}/register/${userID}`,
  getWorkers: (userID) => `${API_BASE_URL_USER}/getWorkers/${userID}`,
  getIntegrators: (userID, managerID = '') => {
    if (managerID) {
      return `${API_BASE_URL_INTEGRATORS}/integrator/${userID}?createdFor=${managerID}`;
    } else {
      return `${API_BASE_URL_INTEGRATORS}/integrator/${userID}`;
    }
  },
  addIntegrator: (userID) => `${API_BASE_URL_INTEGRATORS}/integrator/${userID}`,
  editIntegrator: (userID) =>
    `${API_BASE_URL_INTEGRATORS}/integrator/${userID}`,
  editWorker: (userID) => `${API_BASE_URL_USER}/edit/${userID}`,
  getUser: (requesterID, userID) =>
    `${API_BASE_URL_USER}/getUser/${requesterID}?userID=${userID}`,
  getIntegratorGroups: (userID) =>
    `${API_BASE_URL_INTEGRATORS}/integratorGroup/${userID}`,
  addGroup: (userID) => `${API_BASE_URL_INTEGRATORS}/integratorGroup/${userID}`,
  editGroup: (userID) =>
    `${API_BASE_URL_INTEGRATORS}/integratorGroup/${userID}`,
  addUserToGroup: (userID) => `${API_BASE_URL_USER}/group/${userID}`,
  removeUserFromGroup: (userID) => `${API_BASE_URL_USER}/group/${userID}`,
  addIntegratorToGroup: (userID) =>
    `${API_BASE_URL_INTEGRATORS}/integratorGroup/${userID}/add`,
  removeIntegratorFromGroup: (userID) =>
    `${API_BASE_URL_INTEGRATORS}/integratorGroup/${userID}/remove`,
  getGroupDetails: (userID) =>
    `${API_BASE_URL_INTEGRATORS}/integratorGroup/${userID}/fromGroups`,
};
