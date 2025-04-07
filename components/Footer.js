export default function Footer() {
  return (
    <footer className="bg-gray-300 py-6 mt-16">
      <div className="text-center text-sm text-gray-600">
        Copyright &copy; {new Date().getFullYear()} PinDrop. All rights
        reserved.
      </div>
    </footer>
  );
}
