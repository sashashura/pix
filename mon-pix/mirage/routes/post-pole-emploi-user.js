export default function (schema) {
  const createdUser = schema.users.create({
    firstName: 'Paul',
    lastName: 'Emploi',
  });

  return {
    access_token:
      'aaa.' +
      btoa(
        `{"user_id":${createdUser.id},"source":"pole_emploi_connect","identity_provider_code":"POLE_EMPLOI","iat":1545321469,"exp":4702193958}`
      ) +
      '.bbb',
    id_token: 'id_token',
    user_id: createdUser.id,
  };
}
