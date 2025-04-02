import ContactComponent from '../components/contact-components';
import ContactForm from '../components/contact-form';

export default function ContactPage() {
  return (
    <div className="w-full md:w-5/6 h-full flex flex-col md:flex-row justify-center mx-auto my-8 px-4 md:px-0 gap-8">
      <ContactComponent />
      <ContactForm />
    </div>
  )
}