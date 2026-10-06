import Layout from '../components/Layout.jsx';
import { PageHeader, Exams, Plans, Process, Calculator, Lenses, Materials, SizeSection, Specialist, Repairs, Faq, ServicesCta } from '../sections/services.jsx';

export const servicesCredits = ['svcHead', 'contacts', 'kids', 'dry'];

export default function Services() {
  return (
    <Layout page="services" credits={servicesCredits}>
      <PageHeader />
      <Exams />
      <Plans />
      <Process />
      <Calculator />
      <Lenses />
      <Materials />
      <SizeSection />
      <Specialist />
      <Repairs />
      <Faq />
      <ServicesCta />
    </Layout>
  );
}
