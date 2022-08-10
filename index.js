import DiscordJS, { GatewayIntentBits, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const botId = "301066970881720331";
const deathChannelId = "646648389747998723";

const teams = {
	"Hosidius Hornswogglers": [
		"Chilli",
		"WDGES",
		"Toucann",
		"Allisun",
		"FoxyBaphomet",
		"t otodile",
		"Witchcraftys",
		"n unu",
		"Addy z",
	],
	"Ardy Boyz": [
		"OVLScotsman",
		"Grannt",
		"cowge",
		"Nordstrand",
		"Arlind",
		"Red Staal",
		"Lethal DNA",
		"Vallun",
		"Quinny",
	],
	"Party Hat Power Bombers": [
		"Billers",
		"Tesco Shift",
		"Robbbbb",
		"Camb_o",
		"Pawwsy",
		"Collected it",
		"P0ddy",
		"Mr Jokke",
		"99 Napping",
	],
	"Mor Ul Rek Macho Men": [
		"Spartan",
		"YodasYoda",
		"Complextro",
		"Tau Lord45",
		"NoHelp",
		"RiiOT",
		"Zetsu",
		"2Vadrs",
		"Bensbeard",
	],
	"Goblin Village Grizzly Grapplers": [
		"McMatt",
		"Vampire bob",
		"Exh",
		"Expiring",
		"Scuff Harry",
		"Margery",
		"P ipes",
		"ChloeGemma",
		"Homie Kisser",
	],
};
const deaths = {
	"Hosidius Hornswogglers": 0,
	"Ardy Boyz": 0,
	"Party Hat Power Bombers": 0,
	"Mor Ul Rek Macho Men": 0,
	"Goblin Village Grizzly Grapplers": 0,
};

const client = new DiscordJS.Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.on("ready", () => {
	console.log("Bot is ready");
});

client.on("messageCreate", (message) => {
	const textMessage = message.content;
	const messengerId = message.author.id;
	const channelId = message.channelId;

	if (channelId === deathChannelId) {
		if (messengerId === botId) {
			let deadUserObj = getDeadUser(textMessage);
			if (deadUserObj) {
				console.log("yay " + deadUserObj.username + " died");
				const username = deadUserObj.username;
				const teamName = deadUserObj.teamName;
				deaths[teamName] += 1;
				console.log(deaths);
				const channel = client.channels.cache.get(deathChannelId);

				const exampleEmbed = new EmbedBuilder()
					.setColor(0x0099ff)
					.setTitle("Team Death Counter")
					.setDescription(
						`Hosidius Hornswogglers: ${deaths["Hosidius Hornswogglers"]} \n
                         Ardy Boyz: ${deaths["Ardy Boyz"]} \n
                         Party Hat Power Bombers: ${deaths["Party Hat Power Bombers"]} \n
                         Mor Ul Rek Macho Men: ${deaths["Mor Ul Rek Macho Men"]} \n
                         Goblin Village Grizzly Grapplers: ${deaths["Goblin Village Grizzly Grapplers"]} \n
                        `
					);

				channel.send({ embeds: [exampleEmbed] });
				console.log(channel.messages.messages.embeds);
			}
		}
	}
});

client.login(process.env.TOKEN);

function getDeadUser(msg) {
	let deadUserObj = {};
	let msgArray = msg.split(" ");
	for (let i = 0; i < msgArray.length; i++) {
		Object.keys(teams).forEach((team) => {
			teams[team].forEach((user) => {
				if (msgArray[i].toLowerCase() === user.toLowerCase()) {
					deadUserObj = { username: user, teamName: team };
				}
			});
		});
	}

	if (!isEmpty(deadUserObj)) {
		return deadUserObj;
	} else {
		return false;
	}
}

function isEmpty(object) {
	for (const property in object) {
		return false;
	}
	return true;
}
