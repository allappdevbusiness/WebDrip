import Layout from '../components/Layout.jsx';
import { BookHeader, Booking, Prepare, Schedule, Team, FindUs, Inside, Contact, Policy, AfterVisit, Access } from '../sections/book.jsx';

export const bookCredits = ['bookHead', 't1', 't2', 't3', 't4', 'store', 'exam', 'f7', 'sun', 'f3', 'contacts'];

export default function Book() {
  return (
    <Layout page="book" credits={bookCredits}>
      <BookHeader />
      <Booking />
      <Prepare />
      <AfterVisit />
      <Schedule />
      <Team />
      <FindUs />
      <Inside />
      <Access />
      <Contact />
      <Policy />
    </Layout>
  );
}
