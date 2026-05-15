import { useEffect, useState } from "react";
import { Link, useNavigate } from "@/lib/router-shim";
import { ClientOnly } from "@/components/ClientOnly";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Trophy, Star, Flame } from "lucide-react";
import { fetchLeaderboard, type LeaderboardEntry, type LeaderboardKind } from "@/lib/leaderboards";

function Loading() {
  return <main className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></main>;
}

function Board({ kind }: { kind: LeaderboardKind }) {
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);
  useEffect(() => {
    let alive = true;
    fetchLeaderboard(kind).then((e) => { if (alive) setEntries(e); });
    return () => { alive = false; };
  }, [kind]);
  if (!entries) return <Loading />;
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-6">Encara no hi ha jugadors classificats.</p>;
  }
  const valueOf = (e: LeaderboardEntry) =>
    kind === "wins" ? `${e.stats.wins} V`
      : kind === "level" ? `Niv. ${e.stats.level}`
      : `${e.stats.max_streak}🔥`;
  return (
    <div className="space-y-1.5">
      {entries.map((e) => {
    const label = e.profile.username
      ? e.profile.username
      : "Jugador anònim";
        return (
          <Link
            key={e.profile.user_id}
            to={`/perfil/${e.profile.user_id}`}
            className="w-full flex items-center justify-between rounded-md border p-2 text-left hover:bg-background/60 transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-7 text-center font-bold text-muted-foreground">{e.rank}</span>
              <div className="min-w-0">
                <div className={`font-medium truncate ${e.profile.username ? "" : "italic text-muted-foreground"}`}>{label}</div>
                <div className="text-xs text-muted-foreground">
                  Niv. {e.stats.level} · {e.stats.wins}V/{e.stats.losses}D · ratxa {e.stats.max_streak}
                </div>
              </div>
            </div>
            <div className="text-sm font-semibold tabular-nums">{valueOf(e)}</div>
          </Link>
        );
      })}
    </div>
  );
}

function Inner() {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen p-4 max-w-2xl mx-auto pb-24">
      <header className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/perfil")}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Tornar
        </Button>
        <h1 className="text-xl font-bold">Classificacions</h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top jugadors</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="wins">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="wins"><Trophy className="w-4 h-4 mr-1" />Victòries</TabsTrigger>
              <TabsTrigger value="level"><Star className="w-4 h-4 mr-1" />Nivell</TabsTrigger>
              <TabsTrigger value="streak"><Flame className="w-4 h-4 mr-1" />Ratxa</TabsTrigger>
            </TabsList>
            <TabsContent value="wins" className="mt-3"><Board kind="wins" /></TabsContent>
            <TabsContent value="level" className="mt-3"><Board kind="level" /></TabsContent>
            <TabsContent value="streak" className="mt-3"><Board kind="streak" /></TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}

export default function Classificacions() {
  return <ClientOnly fallback={<Loading />}><Inner /></ClientOnly>;
}