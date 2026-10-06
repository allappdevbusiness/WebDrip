import Layout from '../components/Layout.jsx';
import Newsletter from '../components/Newsletter.jsx';
import { ServicesHeader, Prices, Tiers, Estimate, Inside, Turnaround, Water, Glossary, Care, Guarantee, Faq, ServicesCta } from '../sections/services.jsx';

export const servicesCredits = ['movementTools', 'holder', 'partsBench', 'toolKit', 'skeleton', 'openDial', 'fieldWatch', 'watchRow'];

export default function Services() {
  return (
    <Layout current="services" credits={servicesCredits}>
      <ServicesHeader />
      <Prices />
      <Tiers />
      <Estimate />
      <Inside />
      <Turnaround />
      <Water />
      <Glossary />
      <Care />
      <Guarantee />
      <Faq />
      <ServicesCta />
      <Newsletter />
    </Layout>
  );
}
