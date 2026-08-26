"use client";

import { Component, type ReactNode } from "react";

export class WebglErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("3D hero fell back to static view:", error);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
