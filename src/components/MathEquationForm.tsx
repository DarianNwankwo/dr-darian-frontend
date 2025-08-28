"use client";
import { useState } from "react";
import { api, MathEquationResponse } from "../utils/api";

interface MathEquationFormProps {
  onResult?: (result: MathEquationResponse) => void;
}

export default function MathEquationForm({ onResult }: MathEquationFormProps) {
  const [equation, setEquation] = useState("");
  const [result, setResult] = useState<MathEquationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equation.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await api.sendMathEquation(equation);
      setResult(data);
      onResult?.(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send equation';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Math Equation Calculator</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="equation" className="block text-sm font-medium text-gray-700 mb-2">
            Enter Equation
          </label>
          <input
            id="equation"
            type="text"
            placeholder="e.g., 2+2, 5*3, 10/2"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !equation.trim()}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Sending..." : "Calculate"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <h4 className="font-medium text-green-800 mb-2">Result:</h4>
          <p className="text-green-700 text-sm">
            Received equation: <span className="font-mono">{result.received_equation}</span>
          </p>
        </div>
      )}
    </div>
  );
}
