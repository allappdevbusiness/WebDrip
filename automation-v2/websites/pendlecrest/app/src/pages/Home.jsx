import Layout from '../components/Layout.jsx';
import Newsletter from '../components/Newsletter.jsx';
import { Hero, BenchList, Symptoms, Services, ProcessStory, Restoration, Spotlight, Numbers, Reviews, Visit, Tips, Cta } from '../sections/home.jsx';

export const homeCredits = ['hero', 'gears', 'stopwatch', 'pastelStraps', 'leatherStrap', 'vintageCase', 'pocketGold', 'dialMacro', 'mapDial', 'fieldWatch', 'wrist', 'microscope', 'partsBench'];

export default function Home() {
  return (
    <Layout current="home" credits={homeCredits} loader>
      <Hero />
      <BenchList />
      <Symptoms />
      <Services />
      <ProcessStory />
      <Restoration />
      <Spotlight />
      <Numbers />
      <Reviews />
      <Visit />
      <Tips />
      <Cta />
      <Newsletter />
    </Layout>
  );
}
