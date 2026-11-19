// 🎙 Preguntar: pausa la narración, escucha la pregunta (o la recibe escrita), consulta al servidor,
// lee la respuesta en voz alta y retoma la historia desde la misma frase.
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { C, R } from '../theme';
import { useStore } from '../store';
import { askQuestion } from '../ask';
import { holdNarration, releaseNarration, sayAside } from '../speech';
import { duckMusic } from '../music';

export default function AskSheet({ visible, onClose, tour, chapter }) {
  const store = useStore();
  const [phase, setPhase] = useState('idle'); // idle | listening | thinking | answer | error
  const [q, setQ] = useState('');
  const [answer, setAnswer] = useState('');
  const [err, setErr] = useState('');
  const history = useRef([]);

  useSpeechRecognitionEvent('result', (e) => {
    const text = e.results && e.results[0] ? e.results[0].transcript : '';
    if (text) setQ(text);
    if (e.isFinal && text) send(text);
  });
  useSpeechRecognitionEvent('end', () => setPhase((ph) => (ph === 'listening' ? 'idle' : ph)));
  useSpeechRecognitionEvent('error', (e) => {
    if (e.error === 'no-speech' || e.error === 'aborted') return setPhase('idle');
    setErr(e.error === 'not-allowed' ? 'Rekio necesita permiso para usar el micrófono.' : 'No pude escucharte. Puedes escribir la pregunta.');
    setPhase('error');
  });

  // Al abrir: pausa la narración y baja la música
  useEffect(() => {
    if (!visible) return;
    holdNarration();
    duckMusic(true);
    setQ('');
    setAnswer('');
    setErr('');
    setPhase('idle');
    history.current = [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, chapter && chapter.id]);

  const listen = async () => {
    setErr('');
    try {
      const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!perm.granted) {
        setErr('Sin permiso de micrófono. Puedes escribir la pregunta.');
        return setPhase('error');
      }
      holdNarration(); // corta una respuesta anterior que se esté leyendo, sin perder la historia
      setQ('');
      setPhase('listening');
      ExpoSpeechRecognitionModule.start({ lang: 'es-CL', interimResults: true, continuous: false, maxAlternatives: 1 });
    } catch (e) {
      setErr('El reconocimiento de voz no está disponible. Escribe la pregunta.');
      setPhase('error');
    }
  };

  const send = async (text) => {
    const question = (text || q).trim();
    if (!question) return;
    try {
      ExpoSpeechRecognitionModule.abort();
    } catch (e) {}
    setPhase('thinking');
    setErr('');
    try {
      const a = await askQuestion({ settings: store.settings, q: question, tour, chapter, history: history.current });
      history.current = [...history.current, { q: question, a }].slice(-3);
      setAnswer(a);
      setPhase('answer');
      sayAside(a); // lee la respuesta; al terminar se retoma la historia desde la misma frase
    } catch (e) {
      setErr(e.message);
      setPhase('error');
    }
  };

  const close = () => {
    try {
      ExpoSpeechRecognitionModule.abort();
    } catch (e) {}
    duckMusic(false);
    // Si se está leyendo una respuesta, la historia se retoma sola al terminar; si no, se retoma ahora
    releaseNarration();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={st.backdrop}>
        <View style={st.sheet}>
          <Text style={st.title}>🎙 Pregúntale a Rekio</Text>
          <Text style={st.sub} numberOfLines={2}>
            Sobre «{chapter ? chapter.name : ''}». La historia queda en pausa.
          </Text>
          <ScrollView style={{ maxHeight: 260 }} contentContainerStyle={{ paddingVertical: 8 }}>
            {!!answer && <Text style={st.answer}>{answer}</Text>}
            {phase === 'thinking' && (
              <View style={st.row}>
                <ActivityIndicator color={C.brand} />
                <Text style={st.thinking}>Buscando la respuesta…</Text>
              </View>
            )}
            {!!err && <Text style={st.err}>{err}</Text>}
          </ScrollView>
          <TouchableOpacity style={[st.mic, phase === 'listening' && st.micOn]} onPress={phase === 'listening' ? () => ExpoSpeechRecognitionModule.stop() : listen} disabled={phase === 'thinking'}>
            <Text style={st.micTxt}>{phase === 'listening' ? '● Escuchando… toca para terminar' : answer ? '🎙 Hacer otra pregunta' : '🎙 Toca y pregunta'}</Text>
          </TouchableOpacity>
          <View style={st.inputRow}>
            <TextInput
              style={st.input}
              value={q}
              onChangeText={setQ}
              placeholder="O escribe: ¿quién era Zapata?"
              placeholderTextColor={C.muted}
              returnKeyType="send"
              onSubmitEditing={() => send()}
              editable={phase !== 'thinking'}
            />
            <TouchableOpacity style={st.send} onPress={() => send()} disabled={phase === 'thinking' || !q.trim()}>
              <Text style={st.sendTxt}>Enviar</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={close} style={st.back}>
            <Text style={st.backTxt}>▶ Seguir con la historia</Text>
          </TouchableOpacity>
          <Text style={st.note}>Las respuestas las genera una IA con el texto y las fuentes del capítulo. Pueden tener errores.</Text>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const st = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 28 },
  title: { fontSize: 20, fontWeight: '900', color: C.text },
  sub: { fontSize: 13, color: C.muted, marginTop: 4 },
  answer: { fontSize: 16, color: C.text, lineHeight: 23 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  thinking: { fontSize: 15, color: C.muted },
  err: { fontSize: 14, color: C.bad || '#C0392B', marginTop: 6 },
  mic: { backgroundColor: C.brand, borderRadius: 999, paddingVertical: 15, alignItems: 'center', marginTop: 8 },
  micOn: { backgroundColor: C.text },
  micTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
  inputRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: C.line, borderRadius: R.md, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: C.text },
  send: { justifyContent: 'center', paddingHorizontal: 14, borderRadius: R.md, backgroundColor: C.surface },
  sendTxt: { fontWeight: '800', color: C.text },
  back: { alignItems: 'center', paddingVertical: 14 },
  backTxt: { fontSize: 15, fontWeight: '800', color: C.brand },
  note: { fontSize: 11, color: C.muted, textAlign: 'center' },
});
