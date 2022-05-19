import { writable, derived } from 'svelte/store';

/** @name {colorParametersStore}
	@start {colorParametersStore} */
export const colorParameters = writable({
	mainColors: { color1: { hsl: [150, 0, 100] }, color2: { hsl: [50, 0, 100] } },
	light: {
		color1: {
			hsl: [150, 0, 100],
			derived: ['text1', 'text2', 'text3', 'surface1', 'surface2', 'surface3'],
			text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
			text2: {
				hsl: {
					hsl: [150, 0, 100],
					derived: ['text1'],
					text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
				},
				saturation: 0,
				lightness: 0
			},
			text3: {
				hsl: {
					hsl: [150, 0, 100],
					derived: ['text1', 'text2'],
					text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
					text2: {
						hsl: {
							hsl: [150, 0, 100],
							derived: ['text1'],
							text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
						},
						saturation: 0,
						lightness: 0
					}
				},
				saturation: 0,
				lightness: 0
			},
			surface1: {
				hsl: {
					hsl: [150, 0, 100],
					derived: ['text1', 'text2', 'text3'],
					text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
					text2: {
						hsl: {
							hsl: [150, 0, 100],
							derived: ['text1'],
							text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
						},
						saturation: 0,
						lightness: 0
					},
					text3: {
						hsl: {
							hsl: [150, 0, 100],
							derived: ['text1', 'text2'],
							text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
							text2: {
								hsl: {
									hsl: [150, 0, 100],
									derived: ['text1'],
									text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
								},
								saturation: 0,
								lightness: 0
							}
						},
						saturation: 0,
						lightness: 0
					}
				},
				saturation: 0,
				lightness: 100
			},
			surface2: {
				hsl: {
					hsl: [150, 0, 100],
					derived: ['text1', 'text2', 'text3', 'surface1'],
					text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
					text2: {
						hsl: {
							hsl: [150, 0, 100],
							derived: ['text1'],
							text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
						},
						saturation: 0,
						lightness: 0
					},
					text3: {
						hsl: {
							hsl: [150, 0, 100],
							derived: ['text1', 'text2'],
							text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
							text2: {
								hsl: {
									hsl: [150, 0, 100],
									derived: ['text1'],
									text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
								},
								saturation: 0,
								lightness: 0
							}
						},
						saturation: 0,
						lightness: 0
					},
					surface1: {
						hsl: {
							hsl: [150, 0, 100],
							derived: ['text1', 'text2', 'text3'],
							text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
							text2: {
								hsl: {
									hsl: [150, 0, 100],
									derived: ['text1'],
									text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
								},
								saturation: 0,
								lightness: 0
							},
							text3: {
								hsl: {
									hsl: [150, 0, 100],
									derived: ['text1', 'text2'],
									text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
									text2: {
										hsl: {
											hsl: [150, 0, 100],
											derived: ['text1'],
											text1: {
												hsl: { hsl: [150, 0, 100], derived: [] },
												saturation: 0,
												lightness: 0
											}
										},
										saturation: 0,
										lightness: 0
									}
								},
								saturation: 0,
								lightness: 0
							}
						},
						saturation: 0,
						lightness: 100
					}
				},
				saturation: 0,
				lightness: 100
			},
			surface3: {
				hsl: {
					hsl: [150, 0, 100],
					derived: ['text1', 'text2', 'text3', 'surface1', 'surface2'],
					text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
					text2: {
						hsl: {
							hsl: [150, 0, 100],
							derived: ['text1'],
							text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
						},
						saturation: 0,
						lightness: 0
					},
					text3: {
						hsl: {
							hsl: [150, 0, 100],
							derived: ['text1', 'text2'],
							text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
							text2: {
								hsl: {
									hsl: [150, 0, 100],
									derived: ['text1'],
									text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
								},
								saturation: 0,
								lightness: 0
							}
						},
						saturation: 0,
						lightness: 0
					},
					surface1: {
						hsl: {
							hsl: [150, 0, 100],
							derived: ['text1', 'text2', 'text3'],
							text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
							text2: {
								hsl: {
									hsl: [150, 0, 100],
									derived: ['text1'],
									text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
								},
								saturation: 0,
								lightness: 0
							},
							text3: {
								hsl: {
									hsl: [150, 0, 100],
									derived: ['text1', 'text2'],
									text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
									text2: {
										hsl: {
											hsl: [150, 0, 100],
											derived: ['text1'],
											text1: {
												hsl: { hsl: [150, 0, 100], derived: [] },
												saturation: 0,
												lightness: 0
											}
										},
										saturation: 0,
										lightness: 0
									}
								},
								saturation: 0,
								lightness: 0
							}
						},
						saturation: 0,
						lightness: 100
					},
					surface2: {
						hsl: {
							hsl: [150, 0, 100],
							derived: ['text1', 'text2', 'text3', 'surface1'],
							text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
							text2: {
								hsl: {
									hsl: [150, 0, 100],
									derived: ['text1'],
									text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
								},
								saturation: 0,
								lightness: 0
							},
							text3: {
								hsl: {
									hsl: [150, 0, 100],
									derived: ['text1', 'text2'],
									text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
									text2: {
										hsl: {
											hsl: [150, 0, 100],
											derived: ['text1'],
											text1: {
												hsl: { hsl: [150, 0, 100], derived: [] },
												saturation: 0,
												lightness: 0
											}
										},
										saturation: 0,
										lightness: 0
									}
								},
								saturation: 0,
								lightness: 0
							},
							surface1: {
								hsl: {
									hsl: [150, 0, 100],
									derived: ['text1', 'text2', 'text3'],
									text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
									text2: {
										hsl: {
											hsl: [150, 0, 100],
											derived: ['text1'],
											text1: {
												hsl: { hsl: [150, 0, 100], derived: [] },
												saturation: 0,
												lightness: 0
											}
										},
										saturation: 0,
										lightness: 0
									},
									text3: {
										hsl: {
											hsl: [150, 0, 100],
											derived: ['text1', 'text2'],
											text1: {
												hsl: { hsl: [150, 0, 100], derived: [] },
												saturation: 0,
												lightness: 0
											},
											text2: {
												hsl: {
													hsl: [150, 0, 100],
													derived: ['text1'],
													text1: {
														hsl: { hsl: [150, 0, 100], derived: [] },
														saturation: 0,
														lightness: 0
													}
												},
												saturation: 0,
												lightness: 0
											}
										},
										saturation: 0,
										lightness: 0
									}
								},
								saturation: 0,
								lightness: 100
							}
						},
						saturation: 0,
						lightness: 100
					}
				},
				saturation: 0,
				lightness: 100
			}
		},
		color2: {
			hsl: [50, 0, 100],
			derived: ['text1', 'surface1'],
			text1: { hsl: { hsl: [50, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
			surface1: {
				hsl: {
					hsl: [50, 0, 100],
					derived: ['text1'],
					text1: { hsl: { hsl: [50, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
				},
				saturation: 0,
				lightness: 100
			}
		}
	},
	dark: {
		color1: {
			hsl: [150, 0, 100],
			derived: ['text1', 'text2', 'text3', 'surface1', 'surface2', 'surface3'],
			text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 },
			text2: {
				hsl: {
					hsl: [150, 0, 100],
					derived: ['text1'],
					text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 }
				},
				saturation: 0,
				lightness: 100
			},
			text3: {
				hsl: {
					hsl: [150, 0, 100],
					derived: ['text1', 'text2'],
					text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 },
					text2: {
						hsl: {
							hsl: [150, 0, 100],
							derived: ['text1'],
							text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 }
						},
						saturation: 0,
						lightness: 100
					}
				},
				saturation: 0,
				lightness: 100
			},
			surface1: {
				hsl: {
					hsl: [150, 0, 100],
					derived: ['text1', 'text2', 'text3'],
					text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 },
					text2: {
						hsl: {
							hsl: [150, 0, 100],
							derived: ['text1'],
							text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 }
						},
						saturation: 0,
						lightness: 100
					},
					text3: {
						hsl: {
							hsl: [150, 0, 100],
							derived: ['text1', 'text2'],
							text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 },
							text2: {
								hsl: {
									hsl: [150, 0, 100],
									derived: ['text1'],
									text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 }
								},
								saturation: 0,
								lightness: 100
							}
						},
						saturation: 0,
						lightness: 100
					}
				},
				saturation: 0,
				lightness: 0
			},
			surface2: {
				hsl: {
					hsl: [150, 0, 100],
					derived: ['text1', 'text2', 'text3', 'surface1'],
					text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 },
					text2: {
						hsl: {
							hsl: [150, 0, 100],
							derived: ['text1'],
							text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 }
						},
						saturation: 0,
						lightness: 100
					},
					text3: {
						hsl: {
							hsl: [150, 0, 100],
							derived: ['text1', 'text2'],
							text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 },
							text2: {
								hsl: {
									hsl: [150, 0, 100],
									derived: ['text1'],
									text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 }
								},
								saturation: 0,
								lightness: 100
							}
						},
						saturation: 0,
						lightness: 100
					},
					surface1: {
						hsl: {
							hsl: [150, 0, 100],
							derived: ['text1', 'text2', 'text3'],
							text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 },
							text2: {
								hsl: {
									hsl: [150, 0, 100],
									derived: ['text1'],
									text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 }
								},
								saturation: 0,
								lightness: 100
							},
							text3: {
								hsl: {
									hsl: [150, 0, 100],
									derived: ['text1', 'text2'],
									text1: {
										hsl: { hsl: [150, 0, 100], derived: [] },
										saturation: 0,
										lightness: 100
									},
									text2: {
										hsl: {
											hsl: [150, 0, 100],
											derived: ['text1'],
											text1: {
												hsl: { hsl: [150, 0, 100], derived: [] },
												saturation: 0,
												lightness: 100
											}
										},
										saturation: 0,
										lightness: 100
									}
								},
								saturation: 0,
								lightness: 100
							}
						},
						saturation: 0,
						lightness: 0
					}
				},
				saturation: 0,
				lightness: 0
			},
			surface3: {
				hsl: {
					hsl: [150, 0, 100],
					derived: ['text1', 'text2', 'text3', 'surface1', 'surface2'],
					text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 },
					text2: {
						hsl: {
							hsl: [150, 0, 100],
							derived: ['text1'],
							text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 }
						},
						saturation: 0,
						lightness: 100
					},
					text3: {
						hsl: {
							hsl: [150, 0, 100],
							derived: ['text1', 'text2'],
							text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 },
							text2: {
								hsl: {
									hsl: [150, 0, 100],
									derived: ['text1'],
									text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 }
								},
								saturation: 0,
								lightness: 100
							}
						},
						saturation: 0,
						lightness: 100
					},
					surface1: {
						hsl: {
							hsl: [150, 0, 100],
							derived: ['text1', 'text2', 'text3'],
							text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 },
							text2: {
								hsl: {
									hsl: [150, 0, 100],
									derived: ['text1'],
									text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 }
								},
								saturation: 0,
								lightness: 100
							},
							text3: {
								hsl: {
									hsl: [150, 0, 100],
									derived: ['text1', 'text2'],
									text1: {
										hsl: { hsl: [150, 0, 100], derived: [] },
										saturation: 0,
										lightness: 100
									},
									text2: {
										hsl: {
											hsl: [150, 0, 100],
											derived: ['text1'],
											text1: {
												hsl: { hsl: [150, 0, 100], derived: [] },
												saturation: 0,
												lightness: 100
											}
										},
										saturation: 0,
										lightness: 100
									}
								},
								saturation: 0,
								lightness: 100
							}
						},
						saturation: 0,
						lightness: 0
					},
					surface2: {
						hsl: {
							hsl: [150, 0, 100],
							derived: ['text1', 'text2', 'text3', 'surface1'],
							text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 },
							text2: {
								hsl: {
									hsl: [150, 0, 100],
									derived: ['text1'],
									text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 }
								},
								saturation: 0,
								lightness: 100
							},
							text3: {
								hsl: {
									hsl: [150, 0, 100],
									derived: ['text1', 'text2'],
									text1: {
										hsl: { hsl: [150, 0, 100], derived: [] },
										saturation: 0,
										lightness: 100
									},
									text2: {
										hsl: {
											hsl: [150, 0, 100],
											derived: ['text1'],
											text1: {
												hsl: { hsl: [150, 0, 100], derived: [] },
												saturation: 0,
												lightness: 100
											}
										},
										saturation: 0,
										lightness: 100
									}
								},
								saturation: 0,
								lightness: 100
							},
							surface1: {
								hsl: {
									hsl: [150, 0, 100],
									derived: ['text1', 'text2', 'text3'],
									text1: {
										hsl: { hsl: [150, 0, 100], derived: [] },
										saturation: 0,
										lightness: 100
									},
									text2: {
										hsl: {
											hsl: [150, 0, 100],
											derived: ['text1'],
											text1: {
												hsl: { hsl: [150, 0, 100], derived: [] },
												saturation: 0,
												lightness: 100
											}
										},
										saturation: 0,
										lightness: 100
									},
									text3: {
										hsl: {
											hsl: [150, 0, 100],
											derived: ['text1', 'text2'],
											text1: {
												hsl: { hsl: [150, 0, 100], derived: [] },
												saturation: 0,
												lightness: 100
											},
											text2: {
												hsl: {
													hsl: [150, 0, 100],
													derived: ['text1'],
													text1: {
														hsl: { hsl: [150, 0, 100], derived: [] },
														saturation: 0,
														lightness: 100
													}
												},
												saturation: 0,
												lightness: 100
											}
										},
										saturation: 0,
										lightness: 100
									}
								},
								saturation: 0,
								lightness: 0
							}
						},
						saturation: 0,
						lightness: 0
					}
				},
				saturation: 0,
				lightness: 0
			}
		},
		color2: {
			hsl: [50, 0, 100],
			derived: ['text1', 'surface1'],
			text1: { hsl: { hsl: [50, 0, 100], derived: [] }, saturation: 0, lightness: 100 },
			surface1: {
				hsl: {
					hsl: [50, 0, 100],
					derived: ['text1'],
					text1: { hsl: { hsl: [50, 0, 100], derived: [] }, saturation: 0, lightness: 100 }
				},
				saturation: 0,
				lightness: 0
			}
		},
		parameters: { divisors: { saturation: 100, lightness: 100 } }
	},
	config: {
		colors: {
			main: ['color1', 'color2'],
			variantCategories: ['text', 'surface'],
			color1: { default: [150, 0, 100], variants: { surface: 3, text: 3, other: 0 } },
			color2: { default: [50, 0, 100], variants: { surface: 1, text: 1, other: 0 } }
		},
		themes: {
			options: ['light', 'dark'],
			light: {
				config: { otherParams: [] },
				categories: {
					text: {
						parameters: ['saturation', 'lightness'],
						saturation: { min: 0, max: 50, step: 1, default: 0 },
						lightness: { min: 0, max: 50, step: 1, default: 0 }
					},
					surface: {
						parameters: ['saturation', 'lightness'],
						saturation: { min: 0, max: 50, step: 1, default: 0 },
						lightness: { min: 0, max: 50, step: 1, default: 100 }
					}
				}
			},
			dark: {
				config: { otherParams: ['divisors'] },
				categories: {
					text: {
						parameters: ['saturation', 'lightness'],
						saturation: { min: 0, max: 50, step: 1, default: 0 },
						lightness: { min: 0, max: 50, step: 1, default: 100 }
					},
					surface: {
						parameters: ['saturation', 'lightness'],
						saturation: { min: 0, max: 50, step: 1, default: 0 },
						lightness: { min: 0, max: 50, step: 1, default: 0 }
					},
					divisors: {
						parameters: ['saturation', 'lightness'],
						saturation: { min: 0, max: 5, step: 0.1, default: 100 },
						lightness: { min: 0, max: 5, step: 0.1, default: 100 }
					}
				}
			}
		},
		properties: {
			outline: {
				variants: [
					{
						colorIndex: 1,
						category: 'surface',
						categoryIndex: 0,
						colorReplace: 'outline-color',
						name: 'color-2-outline-1'
					}
				]
			},
			border: {
				variants: [
					{
						colorIndex: 0,
						category: 'text',
						categoryIndex: 1,
						colorReplace: 'border-color',
						name: 'color-1-border-1'
					},
					{
						colorIndex: 0,
						category: 'surface',
						categoryIndex: 1,
						colorReplace: 'border-color',
						name: 'color-1-border-2'
					},
					{
						colorIndex: 1,
						category: 'surface',
						categoryIndex: 0,
						colorReplace: 'border-color',
						name: 'color-1-border-3'
					}
				]
			},
			ring: {
				variants: [
					{
						colorIndex: 0,
						category: 'text',
						categoryIndex: 2,
						colorReplace: '--tw-ring-color',
						name: 'color-1-ring-2'
					},
					{
						colorIndex: 0,
						category: 'main',
						categoryIndex: 0,
						colorReplace: '--tw-ring-color',
						name: 'color-1-ring-1'
					},
					{
						colorIndex: 1,
						category: 'main',
						categoryIndex: 0,
						colorReplace: '--tw-ring-color',
						name: 'color-2-ring-1'
					},
					{
						colorIndex: 1,
						category: 'surface',
						categoryIndex: 0,
						colorReplace: '--tw-ring-color',
						name: 'color-2-ring-2'
					},
					{
						colorIndex: 1,
						category: 'main',
						categoryIndex: 0,
						colorReplace: '--tw-ring-color',
						opacity: 0.5,
						name: 'color-2-ring-3'
					}
				]
			},
			opacity: {
				variants: [
					{
						colorIndex: 0,
						category: 'surface',
						categoryIndex: 1,
						colorReplace: 'background-color',
						opacity: 0.5,
						name: 'color-1-surface-2-opacity-50'
					},
					{
						colorIndex: 1,
						category: 'surface',
						categoryIndex: 0,
						colorReplace: 'background-color',
						opacity: 0.75,
						themeSpecificMods: { dark: { opacity: 0.5 } },
						name: 'color-2-surface-1-opacity-50'
					}
				]
			}
		}
	}
});
/** @end {colorParametersStore} */

/** @name {colorsStore}
	@start {colorsStore} */
export const colors = writable({
	currentTheme: 'light',
	themes: {
		light: {
			color1: {
				hsl: [150, 0, 100],
				text1: { hsl: { hsl: [150, 0, 100], derived: [] } },
				text2: {
					hsl: {
						hsl: [150, 0, 100],
						derived: ['text1'],
						text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
					}
				},
				text3: {
					hsl: {
						hsl: [150, 0, 100],
						derived: ['text1', 'text2'],
						text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
						text2: {
							hsl: {
								hsl: [150, 0, 100],
								derived: ['text1'],
								text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
							},
							saturation: 0,
							lightness: 0
						}
					}
				},
				surface1: {
					hsl: {
						hsl: [150, 0, 100],
						derived: ['text1', 'text2', 'text3'],
						text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
						text2: {
							hsl: {
								hsl: [150, 0, 100],
								derived: ['text1'],
								text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
							},
							saturation: 0,
							lightness: 0
						},
						text3: {
							hsl: {
								hsl: [150, 0, 100],
								derived: ['text1', 'text2'],
								text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
								text2: {
									hsl: {
										hsl: [150, 0, 100],
										derived: ['text1'],
										text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
									},
									saturation: 0,
									lightness: 0
								}
							},
							saturation: 0,
							lightness: 0
						}
					}
				},
				surface2: {
					hsl: {
						hsl: [150, 0, 100],
						derived: ['text1', 'text2', 'text3', 'surface1'],
						text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
						text2: {
							hsl: {
								hsl: [150, 0, 100],
								derived: ['text1'],
								text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
							},
							saturation: 0,
							lightness: 0
						},
						text3: {
							hsl: {
								hsl: [150, 0, 100],
								derived: ['text1', 'text2'],
								text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
								text2: {
									hsl: {
										hsl: [150, 0, 100],
										derived: ['text1'],
										text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
									},
									saturation: 0,
									lightness: 0
								}
							},
							saturation: 0,
							lightness: 0
						},
						surface1: {
							hsl: {
								hsl: [150, 0, 100],
								derived: ['text1', 'text2', 'text3'],
								text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
								text2: {
									hsl: {
										hsl: [150, 0, 100],
										derived: ['text1'],
										text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
									},
									saturation: 0,
									lightness: 0
								},
								text3: {
									hsl: {
										hsl: [150, 0, 100],
										derived: ['text1', 'text2'],
										text1: {
											hsl: { hsl: [150, 0, 100], derived: [] },
											saturation: 0,
											lightness: 0
										},
										text2: {
											hsl: {
												hsl: [150, 0, 100],
												derived: ['text1'],
												text1: {
													hsl: { hsl: [150, 0, 100], derived: [] },
													saturation: 0,
													lightness: 0
												}
											},
											saturation: 0,
											lightness: 0
										}
									},
									saturation: 0,
									lightness: 0
								}
							},
							saturation: 0,
							lightness: 100
						}
					}
				},
				surface3: {
					hsl: {
						hsl: [150, 0, 100],
						derived: ['text1', 'text2', 'text3', 'surface1', 'surface2'],
						text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
						text2: {
							hsl: {
								hsl: [150, 0, 100],
								derived: ['text1'],
								text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
							},
							saturation: 0,
							lightness: 0
						},
						text3: {
							hsl: {
								hsl: [150, 0, 100],
								derived: ['text1', 'text2'],
								text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
								text2: {
									hsl: {
										hsl: [150, 0, 100],
										derived: ['text1'],
										text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
									},
									saturation: 0,
									lightness: 0
								}
							},
							saturation: 0,
							lightness: 0
						},
						surface1: {
							hsl: {
								hsl: [150, 0, 100],
								derived: ['text1', 'text2', 'text3'],
								text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
								text2: {
									hsl: {
										hsl: [150, 0, 100],
										derived: ['text1'],
										text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
									},
									saturation: 0,
									lightness: 0
								},
								text3: {
									hsl: {
										hsl: [150, 0, 100],
										derived: ['text1', 'text2'],
										text1: {
											hsl: { hsl: [150, 0, 100], derived: [] },
											saturation: 0,
											lightness: 0
										},
										text2: {
											hsl: {
												hsl: [150, 0, 100],
												derived: ['text1'],
												text1: {
													hsl: { hsl: [150, 0, 100], derived: [] },
													saturation: 0,
													lightness: 0
												}
											},
											saturation: 0,
											lightness: 0
										}
									},
									saturation: 0,
									lightness: 0
								}
							},
							saturation: 0,
							lightness: 100
						},
						surface2: {
							hsl: {
								hsl: [150, 0, 100],
								derived: ['text1', 'text2', 'text3', 'surface1'],
								text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 },
								text2: {
									hsl: {
										hsl: [150, 0, 100],
										derived: ['text1'],
										text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
									},
									saturation: 0,
									lightness: 0
								},
								text3: {
									hsl: {
										hsl: [150, 0, 100],
										derived: ['text1', 'text2'],
										text1: {
											hsl: { hsl: [150, 0, 100], derived: [] },
											saturation: 0,
											lightness: 0
										},
										text2: {
											hsl: {
												hsl: [150, 0, 100],
												derived: ['text1'],
												text1: {
													hsl: { hsl: [150, 0, 100], derived: [] },
													saturation: 0,
													lightness: 0
												}
											},
											saturation: 0,
											lightness: 0
										}
									},
									saturation: 0,
									lightness: 0
								},
								surface1: {
									hsl: {
										hsl: [150, 0, 100],
										derived: ['text1', 'text2', 'text3'],
										text1: {
											hsl: { hsl: [150, 0, 100], derived: [] },
											saturation: 0,
											lightness: 0
										},
										text2: {
											hsl: {
												hsl: [150, 0, 100],
												derived: ['text1'],
												text1: {
													hsl: { hsl: [150, 0, 100], derived: [] },
													saturation: 0,
													lightness: 0
												}
											},
											saturation: 0,
											lightness: 0
										},
										text3: {
											hsl: {
												hsl: [150, 0, 100],
												derived: ['text1', 'text2'],
												text1: {
													hsl: { hsl: [150, 0, 100], derived: [] },
													saturation: 0,
													lightness: 0
												},
												text2: {
													hsl: {
														hsl: [150, 0, 100],
														derived: ['text1'],
														text1: {
															hsl: { hsl: [150, 0, 100], derived: [] },
															saturation: 0,
															lightness: 0
														}
													},
													saturation: 0,
													lightness: 0
												}
											},
											saturation: 0,
											lightness: 0
										}
									},
									saturation: 0,
									lightness: 100
								}
							},
							saturation: 0,
							lightness: 100
						}
					}
				}
			},
			color2: {
				hsl: [50, 0, 100],
				text1: { hsl: { hsl: [50, 0, 100], derived: [] } },
				surface1: {
					hsl: {
						hsl: [50, 0, 100],
						derived: ['text1'],
						text1: { hsl: { hsl: [50, 0, 100], derived: [] }, saturation: 0, lightness: 0 }
					}
				}
			}
		},
		dark: {
			color1: {
				hsl: [150, 0, 100],
				text1: { hsl: { hsl: [150, 0, 100], derived: [] } },
				text2: {
					hsl: {
						hsl: [150, 0, 100],
						derived: ['text1'],
						text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 }
					}
				},
				text3: {
					hsl: {
						hsl: [150, 0, 100],
						derived: ['text1', 'text2'],
						text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 },
						text2: {
							hsl: {
								hsl: [150, 0, 100],
								derived: ['text1'],
								text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 }
							},
							saturation: 0,
							lightness: 100
						}
					}
				},
				surface1: {
					hsl: {
						hsl: [150, 0, 100],
						derived: ['text1', 'text2', 'text3'],
						text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 },
						text2: {
							hsl: {
								hsl: [150, 0, 100],
								derived: ['text1'],
								text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 }
							},
							saturation: 0,
							lightness: 100
						},
						text3: {
							hsl: {
								hsl: [150, 0, 100],
								derived: ['text1', 'text2'],
								text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 },
								text2: {
									hsl: {
										hsl: [150, 0, 100],
										derived: ['text1'],
										text1: {
											hsl: { hsl: [150, 0, 100], derived: [] },
											saturation: 0,
											lightness: 100
										}
									},
									saturation: 0,
									lightness: 100
								}
							},
							saturation: 0,
							lightness: 100
						}
					}
				},
				surface2: {
					hsl: {
						hsl: [150, 0, 100],
						derived: ['text1', 'text2', 'text3', 'surface1'],
						text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 },
						text2: {
							hsl: {
								hsl: [150, 0, 100],
								derived: ['text1'],
								text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 }
							},
							saturation: 0,
							lightness: 100
						},
						text3: {
							hsl: {
								hsl: [150, 0, 100],
								derived: ['text1', 'text2'],
								text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 },
								text2: {
									hsl: {
										hsl: [150, 0, 100],
										derived: ['text1'],
										text1: {
											hsl: { hsl: [150, 0, 100], derived: [] },
											saturation: 0,
											lightness: 100
										}
									},
									saturation: 0,
									lightness: 100
								}
							},
							saturation: 0,
							lightness: 100
						},
						surface1: {
							hsl: {
								hsl: [150, 0, 100],
								derived: ['text1', 'text2', 'text3'],
								text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 },
								text2: {
									hsl: {
										hsl: [150, 0, 100],
										derived: ['text1'],
										text1: {
											hsl: { hsl: [150, 0, 100], derived: [] },
											saturation: 0,
											lightness: 100
										}
									},
									saturation: 0,
									lightness: 100
								},
								text3: {
									hsl: {
										hsl: [150, 0, 100],
										derived: ['text1', 'text2'],
										text1: {
											hsl: { hsl: [150, 0, 100], derived: [] },
											saturation: 0,
											lightness: 100
										},
										text2: {
											hsl: {
												hsl: [150, 0, 100],
												derived: ['text1'],
												text1: {
													hsl: { hsl: [150, 0, 100], derived: [] },
													saturation: 0,
													lightness: 100
												}
											},
											saturation: 0,
											lightness: 100
										}
									},
									saturation: 0,
									lightness: 100
								}
							},
							saturation: 0,
							lightness: 0
						}
					}
				},
				surface3: {
					hsl: {
						hsl: [150, 0, 100],
						derived: ['text1', 'text2', 'text3', 'surface1', 'surface2'],
						text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 },
						text2: {
							hsl: {
								hsl: [150, 0, 100],
								derived: ['text1'],
								text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 }
							},
							saturation: 0,
							lightness: 100
						},
						text3: {
							hsl: {
								hsl: [150, 0, 100],
								derived: ['text1', 'text2'],
								text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 },
								text2: {
									hsl: {
										hsl: [150, 0, 100],
										derived: ['text1'],
										text1: {
											hsl: { hsl: [150, 0, 100], derived: [] },
											saturation: 0,
											lightness: 100
										}
									},
									saturation: 0,
									lightness: 100
								}
							},
							saturation: 0,
							lightness: 100
						},
						surface1: {
							hsl: {
								hsl: [150, 0, 100],
								derived: ['text1', 'text2', 'text3'],
								text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 },
								text2: {
									hsl: {
										hsl: [150, 0, 100],
										derived: ['text1'],
										text1: {
											hsl: { hsl: [150, 0, 100], derived: [] },
											saturation: 0,
											lightness: 100
										}
									},
									saturation: 0,
									lightness: 100
								},
								text3: {
									hsl: {
										hsl: [150, 0, 100],
										derived: ['text1', 'text2'],
										text1: {
											hsl: { hsl: [150, 0, 100], derived: [] },
											saturation: 0,
											lightness: 100
										},
										text2: {
											hsl: {
												hsl: [150, 0, 100],
												derived: ['text1'],
												text1: {
													hsl: { hsl: [150, 0, 100], derived: [] },
													saturation: 0,
													lightness: 100
												}
											},
											saturation: 0,
											lightness: 100
										}
									},
									saturation: 0,
									lightness: 100
								}
							},
							saturation: 0,
							lightness: 0
						},
						surface2: {
							hsl: {
								hsl: [150, 0, 100],
								derived: ['text1', 'text2', 'text3', 'surface1'],
								text1: { hsl: { hsl: [150, 0, 100], derived: [] }, saturation: 0, lightness: 100 },
								text2: {
									hsl: {
										hsl: [150, 0, 100],
										derived: ['text1'],
										text1: {
											hsl: { hsl: [150, 0, 100], derived: [] },
											saturation: 0,
											lightness: 100
										}
									},
									saturation: 0,
									lightness: 100
								},
								text3: {
									hsl: {
										hsl: [150, 0, 100],
										derived: ['text1', 'text2'],
										text1: {
											hsl: { hsl: [150, 0, 100], derived: [] },
											saturation: 0,
											lightness: 100
										},
										text2: {
											hsl: {
												hsl: [150, 0, 100],
												derived: ['text1'],
												text1: {
													hsl: { hsl: [150, 0, 100], derived: [] },
													saturation: 0,
													lightness: 100
												}
											},
											saturation: 0,
											lightness: 100
										}
									},
									saturation: 0,
									lightness: 100
								},
								surface1: {
									hsl: {
										hsl: [150, 0, 100],
										derived: ['text1', 'text2', 'text3'],
										text1: {
											hsl: { hsl: [150, 0, 100], derived: [] },
											saturation: 0,
											lightness: 100
										},
										text2: {
											hsl: {
												hsl: [150, 0, 100],
												derived: ['text1'],
												text1: {
													hsl: { hsl: [150, 0, 100], derived: [] },
													saturation: 0,
													lightness: 100
												}
											},
											saturation: 0,
											lightness: 100
										},
										text3: {
											hsl: {
												hsl: [150, 0, 100],
												derived: ['text1', 'text2'],
												text1: {
													hsl: { hsl: [150, 0, 100], derived: [] },
													saturation: 0,
													lightness: 100
												},
												text2: {
													hsl: {
														hsl: [150, 0, 100],
														derived: ['text1'],
														text1: {
															hsl: { hsl: [150, 0, 100], derived: [] },
															saturation: 0,
															lightness: 100
														}
													},
													saturation: 0,
													lightness: 100
												}
											},
											saturation: 0,
											lightness: 100
										}
									},
									saturation: 0,
									lightness: 0
								}
							},
							saturation: 0,
							lightness: 0
						}
					}
				}
			},
			color2: {
				hsl: [50, 0, 100],
				text1: { hsl: { hsl: [50, 0, 100], derived: [] } },
				surface1: {
					hsl: {
						hsl: [50, 0, 100],
						derived: ['text1'],
						text1: { hsl: { hsl: [50, 0, 100], derived: [] }, saturation: 0, lightness: 100 }
					}
				}
			}
		}
	}
});
/** @end {colorsStore} */

export const colorPalette = derived(colors, ($colors) =>
	$colors.currentTheme == 'light' ? $colors.themes.light : $colors.themes.dark
);

export const device = writable({
	windowWidth: 0,
	windowHeight: 0
});
