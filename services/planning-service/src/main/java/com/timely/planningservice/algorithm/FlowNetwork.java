package com.timely.planningservice.algorithm;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;
import java.util.Set;

public class FlowNetwork {

    private final Map<String, Map<String, Integer>> capacity = new HashMap<>();
    private final Map<String, Map<String, Integer>> flow = new HashMap<>();
    private final Set<String> nodes = new HashSet<>();

    public void addEdge(String from, String to, int cap) {
        nodes.add(from);
        nodes.add(to);
        capacity.computeIfAbsent(from, k -> new HashMap<>()).merge(to, cap, Integer::sum);
        capacity.computeIfAbsent(to, k -> new HashMap<>()).putIfAbsent(from, 0);
        flow.computeIfAbsent(from, k -> new HashMap<>()).putIfAbsent(to, 0);
        flow.computeIfAbsent(to, k -> new HashMap<>()).putIfAbsent(from, 0);
    }

    public int maxFlow(String source, String sink) {
        int totalFlow = 0;
        Map<String, String> parent = new HashMap<>();
        while (bfs(source, sink, parent)) {
            int pathFlow = Integer.MAX_VALUE;
            for (String v = sink; !v.equals(source); v = parent.get(v)) {
                String u = parent.get(v);
                pathFlow = Math.min(pathFlow, residualCapacity(u, v));
            }
            for (String v = sink; !v.equals(source); v = parent.get(v)) {
                String u = parent.get(v);
                updateFlow(u, v, pathFlow);
                updateFlow(v, u, -pathFlow);
            }
            totalFlow += pathFlow;
            parent.clear();
        }
        return totalFlow;
    }

    private boolean bfs(String source, String sink, Map<String, String> parent) {
        Set<String> visited = new HashSet<>();
        Queue<String> queue = new LinkedList<>();
        queue.add(source);
        visited.add(source);
        while (!queue.isEmpty()) {
            String u = queue.poll();
            for (String v : capacity.getOrDefault(u, Collections.emptyMap()).keySet()) {
                if (!visited.contains(v) && residualCapacity(u, v) > 0) {
                    visited.add(v);
                    parent.put(v, u);
                    if (v.equals(sink)) return true;
                    queue.add(v);
                }
            }
        }
        return false;
    }

    private int residualCapacity(String u, String v) {
        int cap = capacity.getOrDefault(u, Collections.emptyMap()).getOrDefault(v, 0);
        int f = flow.getOrDefault(u, Collections.emptyMap()).getOrDefault(v, 0);
        return cap - f;
    }

    private void updateFlow(String u, String v, int delta) {
        flow.computeIfAbsent(u, k -> new HashMap<>()).merge(v, delta, Integer::sum);
    }

    public Map<String, String> getAssignments() {
        Map<String, String> assignments = new HashMap<>();
        for (String node : nodes) {
            if (!node.startsWith("C_")) continue;
            String courseId = node.substring(2);
            String placementPrefix = "P_" + courseId + "_";
            Map<String, Integer> outFlow = flow.getOrDefault(node, Collections.emptyMap());
            for (Map.Entry<String, Integer> entry : outFlow.entrySet()) {
                if (entry.getValue() == 1 && entry.getKey().startsWith(placementPrefix)) {
                    assignments.put(courseId, entry.getKey().substring(placementPrefix.length()));
                    break;
                }
            }
        }
        return assignments;
    }
}
