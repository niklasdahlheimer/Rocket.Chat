import { property } from '../../helpers/property';
import { dateToFloat } from '../../helpers/dateToFloat';

export const schema = `
	type Message {
		id: String
		author: User
		content: String
		channel: Channel
		creationTime: Float
		# Message sent by server e.g. User joined channel
		fromServer: Boolean
		type: String
		# List of mentioned users
		userRef: [User]
		# list of mentioned channels
		channelRef: [Channel]
		reactions: [Reaction]
	}
`;

export const resolver = {
	Message: {
		id: property('_id'),
		content: property('msg'),
		creationTime: (root) => dateToFloat(root.ts),
		author: (root) => {
			const user = RocketChat.models.Users.findOne(root.u._id);

			return user || root.u;
		},
		channel: (root) => {
			return RocketChat.models.Rooms.findOne(root.rid);
		},
		fromServer: (root) => typeof root.t !== 'undefined', // on a message sent by user `true` otherwise `false`
		type: property('t'),
		channelRef: (root) => {
			if (!root.channels) {
				return;
			}

			return RocketChat.models.Rooms.find({
				_id: {
					$in: root.channels.map(c => c._id)
				}
			}, {
				sort: {
					name: 1
				}
			}).fetch();
		},
		userRef: (root) => {
			if (!root.mentions) {
				return;
			}

			return RocketChat.models.Users.find({
				_id: {
					$in: root.mentions.map(c => c._id)
				}
			}, {
				sort: {
					username: 1
				}
			}).fetch();
		},
		reactions: (root) => {
			if (!root.reactions || Object.keys(root.reactions).length === 0) {
				return;
			}

			const reactions = [];

			Object.keys(root.reactions).forEach(icon => {
				root.reactions[icon].usernames.forEach(username => {
					reactions.push({
						icon,
						username
					});
				});
			});

			return reactions;
		}
	}
};