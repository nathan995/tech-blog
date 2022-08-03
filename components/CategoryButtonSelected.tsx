import React, { MouseEventHandler } from 'react'
import { Category } from '../types'

export function CategoryButtonSelected({
  category,
  onPress,
}: {
  category: Category
  onPress: MouseEventHandler
}) {
  return (
    <div
      className="mr-3 cursor-pointer rounded-lg border bg-green-500 px-4 py-2"
      onClick={onPress}
    >
      <p className="whitespace-nowrap text-white" key={category._id}>
        {category.title}
      </p>
    </div>
  )
}
