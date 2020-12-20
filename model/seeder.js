var mongoose = require("mongoose");
var User = require("./user");
var Cart = require("./shopping-cart");
var Product = require("./product");
var Order = require("./order");

var uri = "mongodb://localhost/bookshop";
mongoose.Promise = global.Promise;

// Some handlers to help us
var db = mongoose.connection;
db.on("connecting", function () {
  console.log("Connecting to ", uri);
});
db.on("connected", function () {
  console.log("Connected to ", uri);
});
db.on("disconnecting", function () {
  console.log("Disconnecting from ", uri);
});
db.on("disconnected", function () {
  console.log("Disconnected from ", uri);
});
db.on("error", function (err) {
  console.error("Error ", err.message);
});

var cart = new Cart({ items: [], qty: 0, total: 0, subtotal: 0, tax: 0 });
var user = new User({
  email: "cristian@gmail.com",
  password: "1234qwert",
  name: "Kristiyan",
  surname: "Stanimirov",
  birth: "1999-07-23",
  address: "Albacete",
  shoppingCart: cart,
});
var products = [
  {
    title: "Percy Jackson and the lightning thief",
    author: "Rick Riordan",
    url: "/images/pj_01.jpg",
    description:
      "Twelve-year-old Percy Jackson is on the most dangerous quest of his life. With the help of a satyr and a daughter of Athena, Percy must journey across the United States to catch a thief who has stolen the original weapon of mass destruction: Zeus’ master bolt. Along the way, he must face a host of mythological enemies determined to stop him. Most of all, he must come to terms with a father he has never known, and an Oracle that has warned him of betrayal by a friend.",
    price: 13.95,
  },
  {
    title: "Percy Jackson and the sea of monsters",
    author: "Rick Riordan",
    url: "/images/pj_02.jpg",
    description:
      "When Thalia’s tree is mysteriously poisoned, the magical borders of Camp Half-Blood begin to fail. Now Percy and his friends have just days to find the only magic item powerful to save the camp before it is overrun by monsters. The catch: they must sail into the Sea of Monsters to find it. Along the way, Percy must stage a daring rescue operation to save his old friend Grover, and he learns a terrible secret about his own family, which makes him question whether being the son of Poseidon is an honor or a curse.",
    price: 13.25,
  },
  {
    title: "Percy Jackson and the titan's curse",
    author: "Rick Riordan",
    url: "/images/pj_03.jpg",
    description:
      "When Percy Jackson gets an urgent distress call from his friend Grover, he immediately prepares for battle. He knows he will need his powerful demigod allies at his side, his trusty bronze sword Riptide, and… a ride from his mom. <br>The demigods rush to the rescue to find that Grover has made an important discovery: two powerful half-bloods whose parentage is unknown. But that’s not all that awaits them. The titan lord Kronos has devised his most treacherous plot yet, and the young heroes have just fallen prey. <br>They’re not the only ones in danger. An ancient monster has arisen (one rumored to be so powerful it could destroy Olympus) and Artemis, the only goddess who might know how to track it, is missing. Now Percy and his friends, along with the Hunters of Artemis, have only a week to find the kidnapped goddess and solve the mystery of the monster she was hunting. Along the way, they must face their most dangerous challenge yet: the chilling prophecy of the titan’s curse.",
    price: 13,
  },
  {
    title: "Percy Jackson and the battle of the laberynth",
    author: "Rick Riordan",
    url: "/images/pj_04.jpg",
    description:
      "Percy Jackson isn’t expecting freshman orientation to be any fun, but when a mysterious mortal acquaintance appears, pursued by demon cheerleaders, things quickly go from bad to worse. <br>Time is running out for Percy. War between the gods and the Titans is drawing near. Even Camp Half-Blood isn’t safe, as Kronos’ army prepares to invade its once impenetrable borders. To stop them, Percy and his friends must set out on a quest through the Labyrinth: a sprawling underground world with surprises and danger at every turn. <br>Along the way Percy will confront powerful enemies, find out the truth about the lost god Pan, and face the Titan lord Kronos’ most terrible secret. The final war begins… with the Battle of the Labyrinth.",
    price: 15.2,
  },
  {
    title: "Percy Jackson and the last olympian",
    author: "Rick Riordan",
    url: "/images/pj_05.jpg",
    description:
      "All year the half-bloods have been preparing for battle against the Titans, knowing the odds of victory are grim. Kronos’s army is stronger than ever, and with every god and half-blood he recruits, the evil Titan’s power only grows. <br>While the Olympians struggle to contain the rampaging monster Typhon, Kronos begins his advance on New York City, where Mount Olympus stands virtually unguarded. Now it’s up to Percy Jackson and an army of young demigods to stop the Lord of Time. In this momentous final book in the New York Times best-selling Percy Jackson and the Olympians series, the long-awaited prophecy surrounding Percy’s sixteenth birthday unfolds. And as the battle for Western civilization rages on the streets of Manhattan, Percy faces a terrifying suspicion that he may be fighting against his own fate.",
    price: 16,
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J. K. Rowling",
    url: "/images/hp_01.jpg",
    description:
      "When mysterious letters start arriving on his doorstep, Harry Potter has never heard of Hogwarts School of Witchcraft and Wizardry. <br>They are swiftly confiscated by his aunt and uncle. <br>Then, on Harry’s eleventh birthday, a strange man bursts in with some important news: Harry Potter is a wizard and has been awarded a place to study at Hogwarts. <br>And so the first of the Harry Potter adventures is set to begin.",
    price: 7.6,
  },
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J. K. Rowling",
    url: "/images/hp_02.jpg",
    description:
      "Throughout the summer holidays after his first year at Hogwarts School of Witchcraft and Wizardry, Harry Potter has been receiving sinister warnings from a house-elf called Dobby. <br>Now, back at school to start his second year, Harry hears unintelligible whispers echoing through the corridors. <br>Before long the attacks begin: students are found as if turned to stone. <br>Dobby’s predictions seem to be coming true.",
    price: 8.55,
  },
  {
    title: "Harry Potter and the Prisoner of Azkaban",
    author: "J. K. Rowling",
    url: "/images/hp_03.jpg",
    description:
      "For Harry Potter, it’s the start of another far-from-ordinary year at Hogwarts when the Knight Bus crashes through the darkness and comes to an abrupt halt in front of him. <br>It turns out that Sirius Black, mass-murderer and follower of Lord Voldemort, has escaped – and they say he is coming after Harry. <br>In his first Divination class, Professor Trelawney sees an omen of death in Harry’s tea leaves. <br>And perhaps most frightening of all are the Dementors patrolling the school grounds with their soul-sucking kiss – in search of fresh victims.",
    price: 10,
  },
  {
    title: "Harry Potter and the Goblet of Fire",
    author: "J. K. Rowling",
    url: "/images/hp_04.jpg",
    description:
      "The rules of the Triwizard Tournament, which is about to take place at Hogwarts, only allow wizards over the age of seventeen to enter. <br>So Harry can only daydream about winning. <br>Then, to his surprise, on Hallowe’en when the Goblet of Fire makes its selection, his name is picked out of the magical cup. <br>Harry will face life-endangering tasks, dragons and Dark wizards. <br>He’ll have to rely on the help of his friends if he is to make it through the contest alive.",
    price: 12.35,
  },
  {
    title: "Harry Potter and the Order of the Phoenix",
    author: "J. K. Rowling",
    url: "/images/hp_05.jpg",
    description:
      "After the Dementors’ attack on his cousin Dudley, Harry knows he is about to become Voldemort’s next target. <br>Although many are denying the Dark Lord’s return, Harry is not alone, and a secret order is gathering at Grimmauld Place to fight against the Dark forces. <br>Meanwhile, Voldemort’s savage assaults on Harry’s mind are growing stronger every day. <br>He must allow Professor Snape to teach him to protect himself before he runs out of time.",
    price: 15.2,
  },
  {
    title: "Harry Potter and the Half-Blood Prince",
    author: "J. K. Rowling",
    url: "/images/hp_06.jpg",
    description:
      "One summer night, when Dumbledore arrives at Privet Drive to collect Harry Potter, his wand hand is blackened and shrivelled, but he will not reveal why. <br>Rumours and suspicion spread through the wizarding world – it feels as if even Hogwarts itself might be under threat. <br>Harry is convinced that Malfoy bears the Dark Mark: could there be a Death Eater amongst them? <br>He will need powerful magic and true friends as, with the help of Dumbledore, he investigates Voldemort’s darkest secrets.",
    price: 14.5,
  },
  {
    title: "Harry Potter and the Deathly Hallows",
    author: "J. K. Rowling",
    url: "/images/hp_07.jpg",
    description:
      "Harry Potter is leaving Privet Drive for the last time. But as he climbs into the sidecar of Hagrid’s motorbike and they take to the skies, he knows Lord Voldemort and the Death Eaters will not be far behind. <br>The protective charm that has kept him safe until now is broken. But the Dark Lord is breathing fear into everything he loves.  And he knows he can’t keep hiding. <br>To stop Voldemort, Harry knows he must find the remaining Horcruxes and destroy them. <br>He will have to face his enemy in one final battle.",
    price: 10.45,
  },
];

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(function () {
    return Cart.deleteMany();
  })
  .then(function () {
    return User.deleteMany();
  })
  .then(function(){
    return Product.deleteMany();
  })
  .then(function(){
    return Order.deleteMany();
  })
  .then(function () {
    return cart.save();
  })
  .then(function () {
    return user.save();
  })
  .then(function () {
    return Product.insertMany(products);
  })
  .then(function () {
    return mongoose.disconnect();
  })
  .catch(function (err) {
    console.error("Error ", err.message);
  });
