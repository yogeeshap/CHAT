import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const chatLogo = 'assets/we__harate--logo.png'

type LogoProps = {
  className?: string
  navigateTo?: string
  style?: object
  logo?: string
}

function Logo({ className, navigateTo, style }: LogoProps) {
  const navigate = useNavigate()
  return (
    <div className="animate-bounce w-24">
    <Box
      className={className}
      component='img'
      src={chatLogo}
      alt='Logo'
      onClick={navigateTo ? () => navigate(navigateTo) : undefined}
      style={style}
    />
    </div>
  )
}

Logo.defaultProps = {
  className: undefined,
  navigateTo: undefined,
  style: {},
  logo: chatLogo,
}

export default Logo
