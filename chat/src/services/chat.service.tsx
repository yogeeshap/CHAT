import config from '../axiosConfig'

const chatServices = {
createRoom(
    data:{
        room_name: string,
        users: object[]
    }
    ) {
    return config.post(`/create_room`,data)
    },

  addUserToRoom(
    { room_id ,data}:{
      room_id:string,
      data:string[]}
    ) {
    return config.patch(`/add_user_to_room/${room_id}`,data)
    },

  findUser(query : string) {
    return config.get(`/search_users?q=${query}`)
    },

  roomUsers(
    { 
      user_id, room_id }:{
      user_id?:string,
      room_id?:string}
  ) {
      return config.get(`/room_users`,{params:{
        ...(user_id && { user_id: user_id }),
      ...(room_id && { room_id: room_id })
      }})
  },

  room(
    room_id:string
  ) {
      return config.get(`/room?room_id=${room_id}`)
  },

  updateRoom(
    { room_id ,data}:{
      room_id:string,
      data:string[]}
  ) {
      return config.patch(`/room/${room_id}`,data)
  },
}

export default chatServices
