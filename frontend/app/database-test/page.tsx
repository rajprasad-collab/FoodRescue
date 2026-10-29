"use client";

import { useEffect, useState } from "react";
import { getDonations, Donation } from "@/lib/donations";

export default function DatabaseTestPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDonations()
      .then((data) => {
        setDonations(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unable to connect to Supabase.");
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold">
        Supabase Connection Test
      </h1>

      {loading && <p className="mt-4 text-sm text-gray-500">Loading donations...</p>}

      {error ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-sm text-gray-600">
            Donations loaded: {donations.length}
          </p>

          <pre className="mt-4 overflow-auto rounded-lg bg-gray-100 p-4 text-xs">
            {JSON.stringify(donations, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
