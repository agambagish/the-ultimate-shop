import { CreateProductForm } from "@/features/dashboard/components/create-product-form";

export default function Page() {
  return (
    <main className="flex flex-col items-center space-y-4 px-6 py-12 md:px-0">
      <div className="space-y-1.5">
        <h1 className="text-3xl leading-tight font-extrabold">
          Create Product
        </h1>
        <p className="text-muted-foreground text-base text-balance">
          Add new product to your store
        </p>
      </div>
      <div className="w-auto md:w-[40rem]">
        <CreateProductForm />
      </div>
    </main>
  );
}
