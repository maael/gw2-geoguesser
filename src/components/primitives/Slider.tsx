import React from 'react'
import { Range, getTrackBackground } from 'react-range'

interface Props {
  label?: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (val: number) => void
  title?: string
  renderValue?: (val: number) => JSX.Element
}

export const ONE_S = 1_000

export default function SliderOuter(props: Props) {
  return (
    <div
      className="flex-1 border rounded-md flex relative overflow-hidden bg-stone-400 bg-opacity-10"
      style={{ borderColor: '#2D1E0E' }}
    >
      <div className="bg-brown-brushed px-2 py-1 flex-0" style={{ backgroundColor: '#2D1E0E' }} title={props.title}>
        {props.label}
      </div>
      <div className="px-2 flex-1 flex justify-center items-center">
        <SliderInner {...props} />
      </div>
      <div className="justify-center items-center text-center flex pr-4">
        {props.renderValue ? props.renderValue(props.value) : props.value}
      </div>
    </div>
  )
}

export function SliderInner({ value, min, max, step = 1, onChange }: Props) {
  const values = [value]
  return (
    <div className="flex-1 px-3">
      <div className="my-3">
        <Range
          min={min}
          max={max}
          step={step}
          values={values}
          onChange={(values) => onChange(values[0])}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '6px',
                width: '100%',
                borderRadius: '4px',
                background: getTrackBackground({
                  values,
                  colors: ['#4D3520', '#9ca3af'],
                  min,
                  max,
                  rtl: false,
                }),
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '20px',
                width: '20px',
                borderRadius: '4px',
                backgroundColor: '#FFF',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0px 2px 6px #AAA',
              }}
            />
          )}
        />
      </div>
    </div>
  )
}
