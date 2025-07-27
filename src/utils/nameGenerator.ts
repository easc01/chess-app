const FIRST_NAMES = [
  'Alex', 'Emma', 'Marcus', 'Sarah', 'David', 'Lisa', 'Michael', 'Anna',
  'James', 'Sophie', 'Robert', 'Maria', 'John', 'Elena', 'William', 'Kate',
  'Daniel', 'Amy', 'Thomas', 'Grace', 'Ryan', 'Olivia', 'Kevin', 'Hannah',
  'Matthew', 'Rachel', 'Christopher', 'Victoria', 'Andrew', 'Jessica',
  'Brian', 'Nicole', 'Steven', 'Michelle', 'Anthony', 'Stephanie',
  'Joshua', 'Lauren', 'Kenneth', 'Ashley', 'Paul', 'Megan', 'Mark', 'Jennifer',
  'Donald', 'Emily', 'George', 'Kimberly', 'Timothy', 'Donna'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen',
  'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera',
  'Campbell', 'Mitchell', 'Carter', 'Roberts'
];

export const generateRandomName = (): string => {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${firstName} ${lastName}`;
};

export const generateRandomFirstName = (): string => {
  return FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
};
