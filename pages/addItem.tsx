import React, { useState, FormEvent } from "react";
import Header from "../components/Header";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { useRouter } from "next/router";

type Props = {};

export default function AddItem({}: Props) {
  const address = useAddress();
  const router = useRouter();
  const [preview, setPreview] = useState<string>();
  const [image, setImage] = useState<File>();

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );

  const mintNft = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!contract || !address) return;

    if (!image) {
      alert("Please select an image");
      return;
    }

    const target = e.target as typeof e.target & {
      name: { value: string };
      description: { value: string };
    };

    const metaData = {
      name: target.name.value,
      description: target.description.value,
      image,
    };

    try {
      const tx = await contract.mintTo(address, metaData);

      console.log("4");

      const receipt = tx.receipt;
      const tokenID = tx.id;
      const nft = await tx.data();

      console.log(receipt, tokenID, nft);

      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Header />

      <main>
        <div className="max-w-6xl mx-auto p-10 border">
          <h1 className="text-4xl">Add an Item to the markeplace</h1>
          <h2 className="text-xl font-semibold pt-5">Item Details</h2>
          <p className="pb-5">
            By adding an item to the marketplace, you are essentially Minting an
            NFT of the item into your wallet which we can list for sale!
          </p>

          <div className="flex flex-col justify-center items-center md:flex-row md:space-x-5 pt-10">
            <img
              className="border h-80 w-80 object-contain"
              src={preview || "https://links.papareact.com/ucj"}
              alt=""
            />

            <form
              onSubmit={mintNft}
              className="flex flex-col flex-1 p-2 space-y-5"
            >
              <div>
                <label className="font-light">Name of item</label>
                <input
                  className="formField"
                  placeholder="Name of item..."
                  type="text"
                  id="name"
                />
              </div>

              <div>
                <label className="font-light">Description</label>
                <input
                  className="formField"
                  placeholder="Enter descriptiom..."
                  type="text"
                  id="description"
                />
              </div>

              <div>
                <label className="font-light">Image of the item</label>
                <input
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setImage(e.target.files[0]);
                      setPreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  className="w-full mb-10"
                  type="file"
                  id="image"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 font-bold text-white rounded-full py-4 px-10 w-56 md:mt-auto mx-auto md:ml-auto"
              >
                Add/Mint Item
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
