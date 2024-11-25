export const HttpStatusEnum = [
  {
    status: 200,
    desc: 'The server successfully returned the requested data.',
    name: '',
  },
  { status: 201, desc: 'New or modified data is successful.', name: '' },
  {
    status: 202,
    desc: 'A request has entered the background queue (asynchronous task).',
    name: '',
  },
  { status: 204, desc: 'The data was deleted successfully.', name: '' },
  {
    status: 400,
    desc: 'There was an error in the request sent, and the server did not create or modify data.',
    name: '',
  },
  {
    status: 401,
    desc: 'The user does not have permission (the token, username, password is wrong).',
    name: '',
  },
  {
    status: 403,
    desc: 'The user is authorized, but access is forbidden. ',
    name: '',
  },
  {
    status: 404,
    desc: 'The request sent was for a record that did not exist, and the server did not operate.',
    name: '',
  },
  { status: 406, desc: 'The requested format is not available.', name: '' },
  {
    status: 410,
    desc: 'The requested resource is permanently deleted and will no longer be available.',
    name: '',
  },
  {
    status: 422,
    desc: 'When creating an object, a validation error occurred.',
    name: '',
  },
  {
    status: 500,
    desc: 'An error occurred in the server, please check the server.',
    name: '',
  },
  { status: 502, desc: 'Gateway error. ', name: '' },
  {
    status: 503,
    desc: 'The services is unavailable, and the server is temporarily overloaded or maintained.',
    name: '',
  },
  { status: 504, desc: 'The gateway timed out. ', name: '' },
];
