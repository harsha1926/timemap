<template>
  <v-row wrap>
    <v-flex
      v-for="user in users"
      :key="user.id"
      xs12
      sm8
      md4
      la2
      xl2
      class="pa-1 mt-1"
    >
      <user :user="user" />
    </v-flex>
  </v-row>
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
          name: 'Sriharsha Samana',
          photo: 'https://loremflickr.com/320/240/man',
          activity: 'sleep',
          time: '11:30 PM',
          status:
            'Today at the bank, an old lady asked me to help check her balance. So I pushed her over.',
          phone: '5142977034',
          country: 'CA'
        },
        {
          id: 2,
          name: 'Neelima',
          photo: 'https://loremflickr.com/320/240/girl',
          activity: 'sleep',
          time: '11:30 PM',
          status:
            "I bought some shoes from a drug dealer. I don't know what he laced them with, but I've been tripping all day.",
          phone: '5142977034',
          country: 'CA'
        },
        {
          id: 3,
          name: 'Mom',
          photo: 'https://loremflickr.com/320/240/woman',
          activity: 'breakfast',
          time: '7:00 AM',
          status:
            'I told my girlfriend she drew her eyebrows too high. She seemed surprised.',
          phone: '5142977034',
          country: 'IN'
        },
        {
          id: 4,
          name: 'Rahul',
          photo: 'https://loremflickr.com/320/240/boy',
          activity: 'work',
          time: '10:30 AM',
          status:
            "A woman walks into a library and asked if they had any books about paranoia. The librarian says 'They're right behind you!'",
          phone: '5142977034',
          country: 'KR'
        },
        {
          id: 5,
          name: 'Daddy',
          photo: 'https://loremflickr.com/320/240/man',
          activity: 'breakfast',
          time: '7:00 AM',
          status:
            "And the lord said unto John, 'Come forth and you will receive eternal life'. John came fifth and won a toaster.",
          phone: '5142977034',
          country: 'IN'
        },
        {
          id: 1,
          name: 'Sriharsha Samana',
          photo: 'https://loremflickr.com/320/240/man',
          activity: 'sleep',
          time: '11:30 PM',
          status:
            'Today at the bank, an old lady asked me to help check her balance. So I pushed her over.',
          phone: '5142977034',
          country: 'CA'
        },
        {
          id: 2,
          name: 'Neelima',
          photo: 'https://loremflickr.com/320/240/girl',
          activity: 'sleep',
          time: '11:30 PM',
          status:
            "I bought some shoes from a drug dealer. I don't know what he laced them with, but I've been tripping all day.",
          phone: '5142977034',
          country: 'CA'
        },
        {
          id: 3,
          name: 'Mom',
          photo: 'https://loremflickr.com/320/240/woman',
          activity: 'breakfast',
          time: '7:00 AM',
          status:
            'I told my girlfriend she drew her eyebrows too high. She seemed surprised.',
          phone: '5142977034',
          country: 'IN'
        },
        {
          id: 4,
          name: 'Rahul',
          photo: 'https://loremflickr.com/320/240/boy',
          activity: 'work',
          time: '10:30 AM',
          status:
            "A woman walks into a library and asked if they had any books about paranoia. The librarian says 'They're right behind you!'",
          phone: '5142977034',
          country: 'KR'
        },
        {
          id: 5,
          name: 'Daddy',
          photo: 'https://loremflickr.com/320/240/man',
          activity: 'breakfast',
          time: '7:00 AM',
          status:
            "And the lord said unto John, 'Come forth and you will receive eternal life'. John came fifth and won a toaster.",
          phone: '5142977034',
          country: 'IN'
        },
        {
          id: 1,
          name: 'Sriharsha Samana',
          photo: 'https://loremflickr.com/320/240/man',
          activity: 'sleep',
          time: '11:30 PM',
          status:
            'Today at the bank, an old lady asked me to help check her balance. So I pushed her over.',
          phone: '5142977034',
          country: 'CA'
        },
        {
          id: 2,
          name: 'Neelima',
          photo: 'https://loremflickr.com/320/240/girl',
          activity: 'sleep',
          time: '11:30 PM',
          status:
            "I bought some shoes from a drug dealer. I don't know what he laced them with, but I've been tripping all day.",
          phone: '5142977034',
          country: 'CA'
        },
        {
          id: 3,
          name: 'Mom',
          photo: 'https://loremflickr.com/320/240/woman',
          activity: 'breakfast',
          time: '7:00 AM',
          status:
            'I told my girlfriend she drew her eyebrows too high. She seemed surprised.',
          phone: '5142977034',
          country: 'IN'
        },
        {
          id: 4,
          name: 'Rahul',
          photo: 'https://loremflickr.com/320/240/boy',
          activity: 'work',
          time: '10:30 AM',
          status:
            "A woman walks into a library and asked if they had any books about paranoia. The librarian says 'They're right behind you!'",
          phone: '5142977034',
          country: 'KR'
        },
        {
          id: 5,
          name: 'Daddy',
          photo: 'https://loremflickr.com/320/240/man',
          activity: 'breakfast',
          time: '7:00 AM',
          status:
            "And the lord said unto John, 'Come forth and you will receive eternal life'. John came fifth and won a toaster.",
          phone: '5142977034',
          country: 'IN'
        },
        {
          id: 1,
          name: 'Sriharsha Samana',
          photo: 'https://loremflickr.com/320/240/man',
          activity: 'sleep',
          time: '11:30 PM',
          status:
            'Today at the bank, an old lady asked me to help check her balance. So I pushed her over.',
          phone: '5142977034',
          country: 'CA'
        },
        {
          id: 2,
          name: 'Neelima',
          photo: 'https://loremflickr.com/320/240/girl',
          activity: 'sleep',
          time: '11:30 PM',
          status:
            "I bought some shoes from a drug dealer. I don't know what he laced them with, but I've been tripping all day.",
          phone: '5142977034',
          country: 'CA'
        },
        {
          id: 3,
          name: 'Mom',
          photo: 'https://loremflickr.com/320/240/woman',
          activity: 'breakfast',
          time: '7:00 AM',
          status:
            'I told my girlfriend she drew her eyebrows too high. She seemed surprised.',
          phone: '5142977034',
          country: 'IN'
        },
        {
          id: 4,
          name: 'Rahul',
          photo: 'https://loremflickr.com/320/240/boy',
          activity: 'work',
          time: '10:30 AM',
          status:
            "A woman walks into a library and asked if they had any books about paranoia. The librarian says 'They're right behind you!'",
          phone: '5142977034',
          country: 'KR'
        },
        {
          id: 5,
          name: 'Daddy',
          photo: 'https://loremflickr.com/320/240/man',
          activity: 'breakfast',
          time: '7:00 AM',
          status:
            "And the lord said unto John, 'Come forth and you will receive eternal life'. John came fifth and won a toaster.",
          phone: '5142977034',
          country: 'IN'
        },
        {
          id: 1,
          name: 'Sriharsha Samana',
          photo: 'https://loremflickr.com/320/240/man',
          activity: 'sleep',
          time: '11:30 PM',
          status:
            'Today at the bank, an old lady asked me to help check her balance. So I pushed her over.',
          phone: '5142977034',
          country: 'CA'
        },
        {
          id: 2,
          name: 'Neelima',
          photo: 'https://loremflickr.com/320/240/girl',
          activity: 'sleep',
          time: '11:30 PM',
          status:
            "I bought some shoes from a drug dealer. I don't know what he laced them with, but I've been tripping all day.",
          phone: '5142977034',
          country: 'CA'
        },
        {
          id: 3,
          name: 'Mom',
          photo: 'https://loremflickr.com/320/240/woman',
          activity: 'breakfast',
          time: '7:00 AM',
          status:
            'I told my girlfriend she drew her eyebrows too high. She seemed surprised.',
          phone: '5142977034',
          country: 'IN'
        },
        {
          id: 4,
          name: 'Rahul',
          photo: 'https://loremflickr.com/320/240/boy',
          activity: 'work',
          time: '10:30 AM',
          status:
            "A woman walks into a library and asked if they had any books about paranoia. The librarian says 'They're right behind you!'",
          phone: '5142977034',
          country: 'KR'
        },
        {
          id: 5,
          name: 'Daddy',
          photo: 'https://loremflickr.com/320/240/man',
          activity: 'breakfast',
          time: '7:00 AM',
          status:
            "And the lord said unto John, 'Come forth and you will receive eternal life'. John came fifth and won a toaster.",
          phone: '5142977034',
          country: 'IN'
        }
      ]
    }
  }
}
</script>
