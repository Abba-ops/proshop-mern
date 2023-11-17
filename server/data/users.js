import bcryptjs from "bcryptjs";

const users = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    password: bcryptjs.hashSync("Zxcvbnm123@", 10),
    isAdmin: false,
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@email.com",
    password: bcryptjs.hashSync("Zxcvbnm123@", 10),
    isAdmin: true,
  },
  {
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@email.com",
    password: bcryptjs.hashSync("Zxcvbnm123@", 10),
    isAdmin: false,
  },
  {
    firstName: "Emily",
    lastName: "Williams",
    email: "emily.williams@email.com",
    password: bcryptjs.hashSync("Zxcvbnm123@", 10),
    isAdmin: false,
  },
  {
    firstName: "Alex",
    lastName: "Brown",
    email: "alex.brown@email.com",
    password: bcryptjs.hashSync("Zxcvbnm123@", 10),
    isAdmin: true,
  },
  {
    firstName: "Sarah",
    lastName: "Davis",
    email: "sarah.davis@email.com",
    password: bcryptjs.hashSync("Zxcvbnm123@", 10),
    isAdmin: false,
  },
  {
    firstName: "Robert",
    lastName: "Taylor",
    email: "robert.taylor@email.com",
    password: bcryptjs.hashSync("Zxcvbnm123@", 10),
    isAdmin: false,
  },
  {
    firstName: "Olivia",
    lastName: "Clark",
    email: "olivia.clark@email.com",
    password: bcryptjs.hashSync("Zxcvbnm123@", 10),
    isAdmin: true,
  },
  {
    firstName: "Daniel",
    lastName: "Moore",
    email: "daniel.moore@email.com",
    password: bcryptjs.hashSync("Zxcvbnm123@", 10),
    isAdmin: false,
  },
  {
    firstName: "Megan",
    lastName: "Baker",
    email: "megan.baker@email.com",
    password: bcryptjs.hashSync("Zxcvbnm123@", 10),
    isAdmin: false,
  },
];

export default users;
