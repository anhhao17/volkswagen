import Link from "next/link";
import { DrivingCar } from "@/components/DrivingCar";

export default function NotFound() {
  return (
    <div className="container-page py-20 text-center">
      <p className="text-6xl font-black text-vw-blue">404</p>
      <h1 className="mt-4 text-2xl font-bold text-vw-dark">Took a wrong turn</h1>
      <p className="mt-2 text-vw-dark/60">This page drove off into the distance.</p>
      <div className="mx-auto mt-8 max-w-xl overflow-hidden rounded-2xl bg-vw-blue/5 p-3">
        <DrivingCar bodyType="Hatchback" color="#001E50" duration={5} />
      </div>
      <Link href="/" className="btn-primary mt-8">Back home</Link>
    </div>
  );
}
