export default {
  async registerCoach(context, data) {
    const userId = context.rootGetters.userId;
    const coacheData = {
      firstName: data.first,
      lastName: data.last,
      description: data.desc,
      hourlyRate: data.rate,
      areas: data.areas,
    };

    /// Send Data To Firebase On Backend
    const response = await fetch(
      `https://vue-http-d0da4-default-rtdb.firebaseio.com/coaches/${userId}.json`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coacheData),
      }
    );

    if (!response.ok) {
      /// error
    }

    context.commit('registerCoach', {
      ...coacheData,
      id: userId,
    });
  },

  async loadCoaches(context, payload) {
    // optional operator ?
    if (!payload?.forceRefresh && !context.getters.shouldUpdate) {
      return;
    }
    const response = await fetch(
      `https:/vue-http-d0da4-default-rtdb.firebaseio.com/coaches.json`
    );
    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(responseData.message || 'Failed to fetch!');
      throw error;
    }
 
    const coaches = [];

    for (const key in responseData) {
      const coach = {
        id: key,
        firstName: responseData[key].firstName,
        lastName: responseData[key].lastName,
        description: responseData[key].description,
        hourlyRate: responseData[key].hourlyRate,
        areas: responseData[key].areas,
      };
      coaches.push(coach);
    }

    context.commit('setCoaches', coaches);
    context.commit('setFetchTimestamp');
  },
};