'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Rule {
  id: string;
  key: string;
  name: string;
  enabled: boolean;
  threshold?: number;
  description: string;
  tags: string[];
}

export function PoliciesManager() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const response = await fetch('/api/policies');
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? 'Falha ao carregar regras.');
        setRules(payload.data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function toggle(rule: Rule) {
    const updated = { ...rule, enabled: !rule.enabled };
    setRules((prev) => prev.map((item) => (item.id === rule.id ? updated : item)));
    await fetch('/api/policies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
  }

  return (
    <div className="space-y-4">
      {loading ? <p className="text-sm text-slate-500">Carregando regras KO...</p> : null}
      {error ? <div className="rounded-xl border border-danger/40 bg-danger/10 p-4 text-sm text-danger">{error}</div> : null}
      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{rule.name}</h3>
                <p className="text-sm text-slate-600">{rule.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {rule.tags.map((tag) => (
                    <Badge key={tag} className="bg-slate-100 text-slate-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right text-sm text-slate-500">
                <p>Chave: {rule.key}</p>
                {rule.threshold ? <p>Limite: {rule.threshold}</p> : null}
                <p className="mt-2 text-xs uppercase">{rule.enabled ? 'Ativa' : 'Desativada'}</p>
                <Button type="button" onClick={() => toggle(rule)} className={rule.enabled ? 'mt-3 bg-danger hover:bg-danger/80' : 'mt-3'}>
                  {rule.enabled ? 'Desativar' : 'Ativar'}
                </Button>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-dashed border-brand/40 bg-brand/5 p-3 text-xs text-brand">
              Simulação rápida: se ativada, impactaria {rule.key.includes('variance') ? '18%' : '7%'} das ordens da semana.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
