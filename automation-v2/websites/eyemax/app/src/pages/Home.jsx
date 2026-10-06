import Layout from '../components/Layout.jsx';
import { Hero, About, Services, Frames, Quiz, Glare, Spotlight, Journey, Reviews, Care, Hours, Cta } from '../sections/home.jsx';

export const homeCredits = ['hero', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'glare', 'spot', 'exam', 'svcHead', 'contacts', 'r1', 'r2', 'r3', 'r4'];

export default function Home() {
  return (
    <Layout page="home" credits={homeCredits} intro>
      <Hero />
      <About />
      <Services />
      <Frames />
      <Quiz />
      <Glare />
      <Spotlight />
      <Journey />
      <Reviews />
      <Care />
      <Hours />
      <Cta />
    </Layout>
  );
}
