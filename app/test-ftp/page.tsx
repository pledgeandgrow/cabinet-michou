"use client";

import { useState } from "react";

export default function TestFTPPage() {
  const [annonceId, setAnnonceId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    if (!annonceId) {
      setError("Veuillez entrer un ID d'annonce");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/test-ftp?id=${annonceId}`);
      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || "Une erreur s'est produite");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Test de l'intégration FTP</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Tester l'envoi FTP d'une annonce</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Cette page vous permet de tester la création et l'envoi d'un fichier CSV pour une annonce existante.
        </p>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="ID de l'annonce"
            value={annonceId}
            onChange={(e) => setAnnonceId(e.target.value)}
            className="border rounded px-3 py-2 max-w-xs"
          />
          <button 
            onClick={handleTest} 
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Test en cours..." : "Tester l'envoi FTP"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <h5 className="font-medium">Erreur</h5>
          </div>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold">
              {result.success ? "Succès" : "Échec"}
            </h2>
          </div>
          <p className="mb-4">{result.message}</p>
          
          {result.csvContent && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Contenu du fichier CSV :</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-96">
                <table className="w-full text-sm">
                  <tbody>
                    {result.csvContent.split('\n').map((line: string, i: number) => (
                      <tr key={i} className={i === 0 ? 'font-bold' : ''}>
                        {line.split(',').map((cell: string, j: number) => (
                          <td key={j} className="border px-2 py-1">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <details className="mt-2">
                <summary className="text-sm text-gray-500 cursor-pointer">Voir le CSV brut</summary>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-48 text-sm mt-2">
                  {result.csvContent}
                </pre>
              </details>
            </div>
          )}
          
          {result.annonce && (
            <div>
              <h3 className="font-semibold mb-2">Détails de l'annonce envoyée :</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-96">
                {JSON.stringify(result.annonce, null, 2)}
              </pre>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-4">
            Vérifiez les logs du serveur pour plus de détails sur l'opération FTP.
          </p>
        </div>
      )}
    </div>
  );
}
