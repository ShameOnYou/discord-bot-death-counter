import DiscordJS, { GatewayIntentBits, EmbedBuilder } from "discord.js";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";
import dotenv from "dotenv";
import keepAlive from './server.js'

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const teamDeathsRef = ref(db, "/teamDeaths");
const userDeathsRef = ref(db, "/userDeaths");
const msgIdRef = ref(db, "/messageId");
let deaths = {};
let userDeaths = {};
let embedId;

onValue(teamDeathsRef, (snapshot) => {
  const data = snapshot.val();
  deaths = data;
});

onValue(userDeathsRef, (snapshot) => {
  const data = snapshot.val();
  userDeaths = data;
});
onValue(msgIdRef, (snapshot) => {
  const data = snapshot.val();
  embedId = data;
});

const botId = "1006614208101761145";
const deathChannelId = "1006614078636175495";
const testerId = "301066970881720331";
const guildId = "857037187579904030";
const testChannelId = "861958645545697390"

const contestants = [
  { name: "chilli", value: "chilli" },
  { name: "WDGES", value: "WDGES" },
  { name: "Toucann", value: "Toucann" },
  { name: "Allisun", value: "Allisun" },
  { name: "FoxyBaphomet", value: "FoxyBaphomet" },
  { name: "t otodile", value: "t otodile" },
  { name: "Witchcraftys", value: "Witchcraftys" },
  { name: "N unu", value: "N unu" },
  { name: "Addy z", value: "Addy z" },
  { name: "OVLScotsman", value: "OVLScotsman" },
  { name: "Grannt", value: "Grannt" },
  { name: "cowge", value: "cowge" },
  { name: "Nordstrand", value: "Nordstrand" },
  { name: "Arlind", value: "Arlind" },
  { name: "Red Staal", value: "Red Staal" },
  { name: "Lethal DNA", value: "Lethal DNA" },
  { name: "Va l", value: "Va l" },
  { name: "Quinny", value: "Quinny" },
  { name: "Billers", value: "Billers" },
  { name: "Tesco Shift", value: "Tesco Shift" },
  { name: "Robbbbb", value: "Robbbbb" },
  { name: "Camb_o", value: "Camb_o" },
  { name: "Pawwsy", value: "Pawwsy" },
  { name: "Collected it", value: "Collected it" },
  { name: "P0ddy", value: "P0ddy" },
  { name: "Mr Jokke", value: "Mr Jokke" },
  { name: "99 Napping", value: "99 Napping" },
  { name: "S partan", value: "S partan" },
  { name: "YodasYoda", value: "YodasYoda" },
  { name: "Complextro", value: "Complextro" },
  { name: "Tau Lord45", value: "Tau Lord45" },
  { name: "NoHelp", value: "NoHelp" },
  { name: "RiiOT", value: "RiiOT" },
  { name: "Zetsu", value: "Zetsu" },
  { name: "2Vadrs", value: "2Vadrs" },
  { name: "Bensbeard", value: "Bensbeard" },
  { name: "MCmattt", value: "MCmattt" },
  { name: "Vampire Bob", value: "Vampire Bob" },
  { name: "Exh", value: "Exh" },
  { name: "Expiring", value: "Expiring" },
  { name: "Scuff Harry", value: "Scuff Harry" },
  { name: "Margery", value: "Margery" },
  { name: "P ipes", value: "P ipes" },
  { name: "ChloeGemma", value: "ChloeGemma" },
  { name: "Homie kisser", value: "Homie kisser" },
];
const teams = {
  "Hosidius Hornswogglers": [
    "chilli",
    "WDGES",
    "Toucann",
    "Allisun",
    "FoxyBaphomet",
    "t otodile",
    "Witchcraftys",
    "N unu",
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
    "Va l",
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
    "S partan",
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
    "MCMattt",
    "Vampire Bob",
    "Exh",
    "Expiring",
    "Scuff Harry",
    "Margery",
    "P ipes",
    "ChloeGemma",
    "Homie kisser",
  ],
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
  const guild = client.guilds.cache.get(guildId);
  let commands;

  if (guild) {
    commands = guild.commands;
  } else {
    commands = client.applications?.commands;
  }

  commands?.create({
    name: "deaths",
    description: "see how bad a user is at the game.",
    options: [
      {
        name: "username",
        description: "runescape username you want to see deaths for.",
        required: true,
        type: 3,
      },
    ],
  });
  commands?.create({
    name: "deathsleaderboard",
    description: "See who is the suckiest of them all.",
  });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  const { commandName, options } = interaction;

  if (commandName === "deaths") {
    console.log("options " + options.getString("username"))
    let deathUsername = options.getString("username");
    let deathString = "";
    const userIndex = Object.keys(userDeaths).findIndex(element => {
      return element.toLowerCase() === deathUsername.toLowerCase();
    });
    if (userIndex !== -1) {
      deathUsername = Object.keys(userDeaths)[userIndex]
      const deathAmount = userDeaths[deathUsername];
      if (deathAmount === 0) {
        deathString = `${deathUsername} has not yet died. Hopefully soon he will.`;
      } else if (deathAmount < 2 && deathAmount > 0) {
        deathString = `${deathUsername} has died ${deathAmount} times. What a loser.`;
      } else if (deathAmount > 2 && deathAmount <= 10) {
        deathString = `${deathUsername} has died ${deathAmount} times. You fucking suck.`;
      } else if (deathAmount > 10) {
        deathString = `${deathUsername} has died ${deathAmount} times. Please uninstall the game.`;
      } else {
        deathString = `${deathUsername} has died ${deathAmount} times. I have no words.`;
      }
    } else {
      deathString = `${deathUsername} is an invalid name, make sure to use in-game names.`;
    }
    interaction.reply({
      content: deathString,
      ephemeral: false,
    });
  } else if (commandName === "deathsleaderboard") {
    let userDeathsObj = userDeaths;
    let res = Object.assign(
      ...Object.entries(userDeathsObj)
        .sort(({ 1: a }, { 1: b }) => b - a)
        .slice(0, 5)
        .map(([k, v]) => ({ [k]: v }))
    );

    const leaderBoardEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Death leaderboard (these guys suck)")
      .setDescription(
        `1. ${Object.keys(res)[0]} with ${res[Object.keys(res)[0]]} deaths.\n
						 2. ${Object.keys(res)[1]} with ${res[Object.keys(res)[1]]} deaths.\n
						 3. ${Object.keys(res)[2]} with ${res[Object.keys(res)[2]]} deaths.\n
						 4. ${Object.keys(res)[3]} with ${res[Object.keys(res)[3]]} deaths.\n
						 5. ${Object.keys(res)[4]} with ${res[Object.keys(res)[4]]} deaths.\n
                        `
      );
    interaction.reply({ embeds: [leaderBoardEmbed] });
  }
});

client.on("messageCreate", (message) => {
  const textMessage = message.content;
  const messengerId = message.author.id;
  const channelId = message.channelId;

  if (channelId === deathChannelId) {
    console.log(textMessage)
    if (messengerId === botId || messengerId === testerId) {
      let deadUserObj = getDeadUser(textMessage);
      if (deadUserObj) {
        const username = deadUserObj.username;
        const teamName = deadUserObj.teamName;
        deaths[teamName] += 1;
        userDeaths[username] += 1;

        const userRef = ref(db, "userDeaths/" + username);
        set(userRef, userDeaths[username]);
        const teamRef = ref(db, "teamDeaths/" + teamName);
        set(teamRef, deaths[teamName]);
        console.log(client.channels);
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

        sendMessage(message, exampleEmbed, embedId, channel);
      }
    }
  }
});

client.login(process.env.TOKEN);

function getDeadUser(msg) {
  let deadUserObj = {};

  Object.keys(teams).forEach((team) => {
    teams[team].forEach((user) => {
      if (msg.includes(user)) {
        deadUserObj = { username: user, teamName: team };
      }
    });
  });

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

async function sendMessage(message, embedMsg, id, channel) {
  if (id === 0) {
    try {
      let message = await channel.send({ embeds: [embedMsg] });
      embedId = message.id;
      const userRef = ref(db, "messageId/");
      set(userRef, embedId);
    } catch (e) {
      console.log(e);
    }
  } else {
    try {
      message.channel.messages.fetch(id).then((msg) => {
        msg.edit({ embeds: [embedMsg] });
      });
    } catch (e) {
      console.log(e);
    }
  }
}

keepAlive()