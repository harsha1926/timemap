<template>
  <v-col>
    <user v-for="user in users" :key="user.id" :user="user" />
  </v-col>
</template>
<script>
import User from './User'
export default {
  components: {
    User
  },
  data() {
    return {
      users: [
        {
          id: 1,
          name: 'Harsha',
          photo: 'https://loremflickr.com/320/240/man',
          activity: 'sleep',
          time: '11:30 PM',
          status:
            'Today at the bank, an old lady asked me to help check her balance. So I pushed her over.'
        },
        {
          id: 2,
          name: 'Neelima',
          photo: 'https://loremflickr.com/320/240/girl',
          activity: 'sleep',
          time: '11:30 PM',
          status:
            "I bought some shoes from a drug dealer. I don't know what he laced them with, but I've been tripping all day."
        },
        {
          id: 3,
          name: 'Mom',
          photo: 'https://loremflickr.com/320/240/woman',
          activity: 'breakfast',
          time: '7:00 AM',
          status:
            'I told my girlfriend she drew her eyebrows too high. She seemed surprised.'
        },
        {
          id: 4,
          name: 'Rahul',
          photo: 'https://loremflickr.com/320/240/boy',
          activity: 'work',
          time: '10:30 AM',
          status:
            "A woman walks into a library and asked if they had any books about paranoia. The librarian says 'They're right behind you!'"
        },
        {
          id: 5,
          name: 'Daddy',
          photo: 'https://loremflickr.com/320/240/man',
          activity: 'breakfast',
          time: '7:00 AM',
          status:
            "And the lord said unto John, 'Come forth and you will receive eternal life'. John came fifth and won a toaster."
        },
        {
          id: 6,
          name: 'Cat',
          photo: 'https://loremflickr.com/320/240/cat',
          activity: 'free',
          time: '7:00 PM',
          status:
            "I couldn't figure out why the baseball kept getting larger. Then it hit me."
        }
      ]
    }
  }
}
</script>
