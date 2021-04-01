import LandingNavBar from '../components/LandingNavBar';

type Props = {
  setRedirect: (
    value: boolean
  ) => void;
};
const LandingPageContainer: FC <Props> = ({setRedirect}: Props) => {
  return (
  <LandingNavBar />
  )
};
export default LandingPageContainer;