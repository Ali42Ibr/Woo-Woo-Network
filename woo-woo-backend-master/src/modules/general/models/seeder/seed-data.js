import faker from 'faker';
import db from '../index';

// seed user with healer profile with location
export const createHealerBulk = async () => {
  // init healer list
  const healerList = [];
  for (let i = 0; i < 10; i++) {
    healerList.push({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      role: 'healer',
      uid: faker.datatype.uuid(),
      photo: `photo_${i + 1}.jpg`,
    });
  }

  // create healer account in database
  let response = await db.User.bulkCreate(healerList, {
    returning: true,
  });

  // get user id from return response
  const healerProfile = response.map((user) => {
    return {
      accountId: user.id,
      brandName: faker.company.companyName(),
      description: faker.company.catchPhrase(),
      paymentAccountId: faker.datatype.string(),
    };
  });
  response = await db.HealerProfile.bulkCreate(healerProfile, {
    returning: true,
  });

  // services for a test user  (id = 6)
  const name = "Therapy"
  const price = 1.15
  const description = "Talk about your problems with me"
  const timeLength = 30
  const cleanUpTime = 2
  const healerProfileId = 6
  const isAvailableOnline = true

  




    /**id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  name: {
    type: Sequelize.STRING,
  },
  price: {
    type: Sequelize.FLOAT,
  },
  description: {
    type: Sequelize.STRING,
  },
  timeLength: {
    type: Sequelize.INTEGER,
  },
  cleanUpTime: {
    type: Sequelize.INTEGER,
  },
  healerProfileId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    reference: {
      model: 'HealerProfiles',
      key: 'id',
    },
  },
  isAvailableOnline: {
    type: Sequelize.BOOLEAN,
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
});

**/

  // create healer location


  //adding real user location for testing purposes

  const fakeStreetAddress = ['380 Providence Ave 28','710 Tozer Crt','1490 Gordon Dr 301','3335 Richter St 203','2479 BC-97','1555 Banks Rd','120 Old Vernon Rd'
,'2120 Harvey Ave','1938 Kane Rd','155 Hollywood Rd N'];
  const fakeCity = 'Kelowna';
  const fakeState = 'BC';
  const fakeCountry = 'Canada';
  const fakeZipCode = ['V1W 4Z6','V1W 2P8','V1Y 3G5','V1W 3Y1','V1X 4J2','V1X 7Y8','V1X 4R2','V1Y 6G8','V1V 2J9','V1X 6B4'];

  const healerLocation = response.map((user) => {
    return {
      address: fakeStreetAddress[Number(user.id)-1],
      city: fakeCity,
      province: fakeState,
      country: fakeCountry,
      postalCode: fakeZipCode[Number(user.id)-1],
      userId: user.id,
    }
  });



  /*const healerTags = response.map((user) => {
    return {

    }
  })*/

  response = await db.Location.bulkCreate(healerLocation, {
    returning: true,
  });

  const generalTags = [
  {id:0,name:"Anxiety",},{id:1,name:"Life patterns",},{id:2,name:"Love life"},{id:3,name:"Family relationships"},{id:4,name:"Life purpose"},
  {id:5,name:"Depression"},
]

  await db.Tag.bulkCreate(generalTags, {
    returning: true,
  });

  const fakeIds = [0,1,3,4,5,1,2,3,4,5];

  console.log("Healer Tags");

  const healerTags = response.map((user) => {
    return {
      healerProfileId: user.id,
      tagId: fakeIds[Number(user.id)-1],
    }
  });

  console.log(healerTags);

  response = await db.HealerTag.bulkCreate(healerTags, {
    returning: true,
  });

  //original function for fake data
  /*const healerLocation = response.map((user) => {
    return {
      address: faker.address.streetAddress(),
      city: faker.address.city(),
      province: faker.address.stateAbbr(),
      country: faker.address.country(),
      postalCode: faker.address.zipCode(),
      userId: user.id,
    }
  }); */


  // get healer profile id from return response
  // the 'response' variable used here was null, im not sure what they were trying to do
  const healerProfileIdList = [1,2,3,4];

  let serviceList = [];
  // create healer service
  for(let i = 0; i < 3; i++){
    const tempList = healerProfileIdList.map((healerId) => {
      return {
        name: faker.prod,
        description: faker.lorem.sentence(),
        price: faker.datatype.number({ min: 50, max: 100 }),
        healerProfileId: healerId,
        timeLength: faker.datatype.number({ min: 30, max: 120 }),
        cleanUpTime: faker.datatype.number({ min: 15, max: 60 }),
        isAvailableOnline: faker.datatype.boolean(),
        healerProfileId: healerId,
      };
    });
    serviceList = [...serviceList, ...tempList];
  }

  // create service in database
  const serviceListRes = await db.Service.bulkCreate(serviceList, {
    returning: true,
  });

  // create client account
  const clientList = [];
  for (let i = 0; i < 10; i++) {
    clientList.push({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      role: 'client',
      uid: faker.datatype.uuid(),
    });
  }

  response = await db.User.bulkCreate(clientList, {
    returning: true,
  });

  // create appointment list from client
  const appointmentList = [];
  for (let i = 0; i < 10; i++) {
    appointmentList.push({
      serviceId: serviceListRes[i].id,
      clientId: response[i].id,
      healerProfileId: serviceListRes[i].healerProfileId,
      sessionTime: "2022-01-26 12:00:00.000 +00:00",
      sessionLength: serviceListRes[i].timeLength,
      price: serviceListRes[i].price,
      status: 'paid',
      cleanUpTime: serviceListRes[i].cleanUpTime,
      serviceName: serviceListRes[i].name,
    });
  }

  const appointmentRes = await db.Appointment.bulkCreate(appointmentList, {
    returning: true,
  });

  for (let i = 0; i < 20; i++) {
    // create review for each appointment
    let reviewList = appointmentRes.map((appointment) => {
      return {
        appointmentId: appointment.id,
        description: faker.lorem.sentence(),
        rating: faker.datatype.number({ min: 1, max: 5 }),
        reviewerId: appointment.clientId,
      };
    });

    const reviewRes = await db.Review.bulkCreate(reviewList, {
      returning: true,
    });
  }
};

export const seedDataForExistUser = async () => {
  const appointmentList = [];
  for (let i = 0; i < 10; i++) {
    appointmentList.push({
      serviceId: 32,
      clientId: 22,
      healerProfileId: 11,
      sessionTime: faker.date.past(),
      sessionLength: 50,
      price: 40,
      status: 'paid',
      cleanUpTime: 1,
      serviceName: faker.prod,
    });
  };
  await db.Appointment.bulkCreate(appointmentList, {});
};



//change start and end times for testing, probably need to create a better seed structure
const healerScheduleList = [];
for (let i = 0; i < 10; i++) {
  healerScheduleList.push({
    healerProfileId: i+1,
    startTime: "2022-01-26 09:00:00.000 +00:00",
    endTime: "2022-01-26 11:00:00.000 +00:00"
  });
}

const response = db.HealerSchedule.bulkCreate(healerScheduleList, {
  returning: true,
});


/**
healerProfileId: {
  type: Sequelize.INTEGER,
  reference: {
    model: 'HealerProfiles',
    key: 'id',
  },
},

startTime: {
  allowNull: false,
  type: Sequelize.DATE, // year should be 20** at this point
},
endTime: {
  allowNull: false,
  type: Sequelize.DATE, // month should be 1 - 12
},

*/
