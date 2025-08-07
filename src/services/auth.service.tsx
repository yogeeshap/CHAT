
import config from '../axiosConfig'

const authServices = {
  login(
    data:{
        email: string,
        password: string | number}
  ) {
    return config.post(`/login/`,data)
  },
    logout() {
        return config.get(`/logout/`)
    },

    register(
        data:{
        email: string,
        password: string | number,
        username: string
    }
    ) {
        return config.post(`/register`,data)
    }
}

export default authServices
