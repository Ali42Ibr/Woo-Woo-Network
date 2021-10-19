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
  // create healer location
  const healerLocation = response.map((user) => {
    return {
      address: faker.address.streetAddress(),
      city: faker.address.city(),
      province: faker.address.stateAbbr(),
      country: faker.address.country(),
      postalCode: faker.address.zipCode(),
      userId: user.id,
    }
  });

  response = await db.Location.bulkCreate(healerLocation, {
    returning: true,
  });

  // get healer profile id from return response
  const healerProfileIdList = response.map((healerProfile) => healerProfile.id);

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
      sessionTime: faker.date.past(),
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
