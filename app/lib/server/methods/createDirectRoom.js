import { Meteor } from 'meteor/meteor';
import { hasPermission } from '../../../authorization';
import { createRoom } from '../functions';

Meteor.methods({
	createDirectRoom(members, customFields = {}, extraData = {}) {

		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'createChannel' });
		}

		if (!hasPermission(Meteor.userId(), 'create-d')) {
			throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'createChannel' });
		}
		return createRoom('d', 0, Meteor.user() && Meteor.user().username, members, 0, { customFields, ...extraData });
	},
});