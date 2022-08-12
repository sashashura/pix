// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'adminMembe... Remove this comment to see the full error message
const adminMemberSerializer = require('../../infrastructure/serializers/jsonapi/admin-member-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findAll() {
    const adminMembers = await usecases.getAdminMembers();
    return adminMemberSerializer.serialize(adminMembers);
  },

  async getCurrentAdminMember(request: $TSFixMe) {
    const authenticatedUserId = request.auth.credentials.userId;
    const userDetailsForAdmin = await usecases.getAdminMemberDetails({ userId: authenticatedUserId });
    return adminMemberSerializer.serialize(userDetailsForAdmin);
  },

  async updateAdminMember(request: $TSFixMe) {
    const id = request.params.id;
    const { role } = await adminMemberSerializer.deserialize(request.payload);
    const updatedAdminMember = await usecases.updateAdminMember({ id, role });
    return adminMemberSerializer.serialize(updatedAdminMember);
  },

  async deactivateAdminMember(request: $TSFixMe, h: $TSFixMe) {
    const id = request.params.id;
    await usecases.deactivateAdminMember({ id });
    return h.response().code(204);
  },

  async saveAdminMember(request: $TSFixMe, h: $TSFixMe) {
    const attributes = await adminMemberSerializer.deserialize(request.payload);
    const savedAdminMember = await usecases.saveAdminMember(attributes);
    return h.response(adminMemberSerializer.serialize(savedAdminMember)).created();
  },
};
